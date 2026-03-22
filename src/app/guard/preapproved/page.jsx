"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { QrCode, Upload, LogIn, Loader2, Info, CheckCircle2 } from "lucide-react";
import { showToast } from "@/lib/toast";
import jsQR from "jsqr";

export default function QRCheckinPage() {
  const [qrCode, setQrCode] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const payload = { qrCodeData: qrCode };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/checkin/qrcode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        showToast.success("Checked in", "Visitor has been checked in successfully");
        router.push("/guard");
      } else {
        showToast.error("Check-in failed", data.message || "Invalid QR code");
      }
    } catch (err) {
      showToast.error("Error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRCodeImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (event) {
      img.src = event.target.result;
      setImagePreview(img.src);
    };

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCodeResult = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCodeResult) {
        setQrCode(qrCodeResult.data);
        showToast.success("QR decoded", "QR code read from image");
      } else {
        showToast.error("No QR detected", "Could not find a QR code in the image");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pre-approved Check-in</h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Scan a pre-approved visitor&apos;s QR code to check them in
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* QR Input — takes 2/3 */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            {/* QR input */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">QR Code String</Label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="Paste QR code string"
                  className="pl-10 h-11 font-medium"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-semibold text-muted-foreground uppercase">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Upload QR Image</Label>
              <label
                htmlFor="qr-checkin-upload"
                className="flex items-center justify-center gap-3 h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/30 hover:bg-accent/30 transition-colors cursor-pointer"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="h-36 object-contain rounded"
                    alt="QR preview"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">Click to upload QR code</span>
                    <span className="text-xs">JPG, PNG supported</span>
                  </div>
                )}
              </label>
              <input
                id="qr-checkin-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleQRCodeImage}
              />
            </div>

            {/* QR indicator */}
            {qrCode && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20"
              >
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <div>
                  <p className="text-sm font-semibold">QR Code Ready</p>
                  <p className="text-xs text-muted-foreground font-medium">Data captured and ready for check-in</p>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleCheckIn}
              disabled={!qrCode || isLoading}
              className="w-full sm:w-auto h-11 px-8 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Check In Visitor
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold mb-1">Pre-approved visitors</h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5 font-medium">
                    <li>1. Host pre-approves the visitor in advance</li>
                    <li>2. Visitor receives a QR code via email</li>
                    <li>3. Scan or paste the QR code here</li>
                    <li>4. Visitor is checked in instantly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
