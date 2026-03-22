"use client";

import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download,
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  FileText,
  Building2,
} from "lucide-react";
import { showToast } from "@/lib/toast";

function BadgePage() {
  const [visitor, setVisitor] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const badgeRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    const fetchLastCheckedInVisitor = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/status/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setVisitor(data.visitor);

        if (data.visitor.qrCode) {
          const qr = await QRCode.toDataURL(data.visitor.qrCode);
          setQrImage(qr);
        }
      } catch (err) {
        showToast.error("Error", "Failed to load badge data");
      }
    };

    fetchLastCheckedInVisitor();
  }, [id]);

  const generatePDF = async () => {
    try {
      const canvas = await html2canvas(badgeRef.current);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [400, 600],
      });

      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save(`${visitor?.fullName}_badge.pdf`);
      showToast.success("Downloaded", "Badge PDF saved successfully");
    } catch (err) {
      showToast.error("PDF Error", "Failed to generate PDF");
    }
  };

  if (!visitor) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const details = [
    { icon: Mail, label: "Email", value: visitor.email },
    { icon: Phone, label: "Phone", value: visitor.contactInfo },
    { icon: FileText, label: "Purpose", value: visitor.purpose },
    { icon: Building2, label: "Organization", value: visitor.organization },
  ];

  return (
    <div>
      <div className="animate-fade-in flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Visitor Badge</h1>
          <p className="text-muted-foreground mt-1">
            Print or download the visitor badge
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/guard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="animate-fade-in flex justify-center">
        {/* Badge card — this is what gets captured as PDF */}
        <Card className="w-[340px] overflow-hidden" ref={badgeRef}>
          {/* Header stripe */}
          <div className="h-2 bg-primary" />

          <div className="p-6 text-center">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Visitor Badge
            </p>

            {/* Photo */}
            <div className="mb-4">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${visitor.photo}` || "/placeholder.jpg"}
                alt="Visitor"
                className="w-20 h-20 rounded-full mx-auto border-2 border-border object-cover"
              />
            </div>

            {/* Name */}
            <h2 className="text-lg font-semibold tracking-tight mb-1">
              {visitor.fullName}
            </h2>

            {/* Details */}
            <div className="space-y-2 mt-4 text-left">
              {details.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">{item.label}:</span>
                    <span className="text-xs font-medium truncate">{item.value || "N/A"}</span>
                  </div>
                );
              })}
            </div>

            {/* QR Code */}
            <div className="mt-6 pt-4 border-t border-border">
              {qrImage ? (
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="mx-auto w-28 h-28"
                />
              ) : (
                <div className="flex items-center justify-center w-28 h-28 mx-auto bg-muted rounded">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-2">
                Scan for verification
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <BadgePage />
    </Suspense>
  );
}
