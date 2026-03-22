"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { QrCode, Upload, Loader2, LogOut, Info, CheckCircle2 } from "lucide-react";
import { showToast } from "@/lib/toast";
import jsQR from "jsqr";

export default function GuardCheckoutPage() {
  const [qrData, setQrData] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleQRCodeImage = async (e) => {
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
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        try {
          const parsed = JSON.parse(qrCode.data);
          setQrData(qrCode.data);
          setVisitorId(parsed.visitorId);
          showToast.success("QR decoded", "Visitor ID extracted");
        } catch {
          showToast.error("Invalid QR", "QR code content is not valid");
        }
      } else {
        showToast.error("No QR detected", "Could not find a QR code in the image");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleManualPaste = (e) => {
    const value = e.target.value;
    setQrData(value);
    try {
      const parsed = JSON.parse(value);
      setVisitorId(parsed.visitorId);
    } catch {
      setVisitorId("");
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!visitorId) {
      showToast.warning("Missing ID", "No visitor ID available");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/${visitorId}/checkout`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        showToast.success("Checked out", "Visitor has been checked out successfully");
        setQrData("");
        setVisitorId("");
        setImagePreview(null);
      } else {
        showToast.error("Checkout failed", data.message || "Something went wrong");
      }
    } catch (err) {
      showToast.error("Server error", "Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Checkout Visitor</h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Scan or upload a QR code to check out a visitor
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* QR Input — takes 2/3 */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            {/* Manual QR input */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">QR Code String</Label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={qrData}
                  onChange={handleManualPaste}
                  placeholder="Paste QR code data here"
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

            {/* Upload QR image */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Upload QR Image</Label>
              <label
                htmlFor="qr-upload"
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
                id="qr-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleQRCodeImage}
              />
            </div>

            {/* Visitor ID indicator */}
            {visitorId && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20"
              >
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Visitor ID Detected</p>
                  <p className="text-xs font-mono text-muted-foreground">{visitorId}</p>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={!visitorId || isLoading}
              className="w-full sm:w-auto h-11 px-8 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Check Out Visitor
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
                  <h3 className="text-sm font-semibold mb-1">How to checkout</h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5 font-medium">
                    <li>1. Get the visitor&apos;s QR code from their badge</li>
                    <li>2. Either paste the QR string or upload the QR image</li>
                    <li>3. The visitor ID will be auto-detected</li>
                    <li>4. Click &ldquo;Check Out Visitor&rdquo; to complete</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <QrCode className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold mb-1">QR Format</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    The QR code should contain a JSON string with a <code className="text-xs bg-muted px-1 py-0.5 rounded">visitorId</code> field.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
