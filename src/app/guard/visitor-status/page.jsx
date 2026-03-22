"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  User,
  Mail,
  Phone,
  FileText,
  Building2,
  UserPlus,
  LogIn,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { showToast } from "@/lib/toast";

export default function VisitorStatusPage() {
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("lastRegisteredVisitor");
    if (stored) {
      setVisitor(JSON.parse(stored));
    }
  }, []);

  if (!visitor) {
    return (
      <div className="text-center py-16">
        <div className="animate-fade-in">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold mb-2">No visitor found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Please register a visitor first
          </p>
          <Button onClick={() => router.push("/guard/register")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register Visitor
          </Button>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/status/${visitor.visitor._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      visitor.visitor.status = data.visitor.status;
      setVisitor({ ...visitor });
      showToast.info("Status refreshed", `Current status: ${data.visitor.status}`);
    } catch (err) {
      showToast.error("Refresh failed", "Could not fetch latest status");
    }
    setLoading(false);
  };

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/${visitor.visitor._id}/checkin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Check-in failed");
      }

      showToast.success("Checked in", "Visitor has been checked in successfully");
      router.push(`/guard/badge?id=${visitor.visitor._id}`);
    } catch (error) {
      showToast.error("Check-in failed", error.message);
    }
  };

  const statusConfig = {
    Pending: { variant: "outline", className: "border-primary/30 text-primary bg-primary/5" },
    Approved: { variant: "outline", className: "border-success/30 text-success bg-success/5" },
    Rejected: { variant: "outline", className: "border-destructive/30 text-destructive bg-destructive/5" },
  };

  const status = visitor.visitor.status;
  const badgeConfig = statusConfig[status] || statusConfig.Pending;

  const details = [
    { icon: User, label: "Name", value: visitor.visitor.fullName },
    { icon: Mail, label: "Email", value: visitor.visitor.email },
    { icon: Phone, label: "Phone", value: visitor.visitor.contactInfo },
    { icon: FileText, label: "Purpose", value: visitor.visitor.purpose },
    { icon: Building2, label: "Organization", value: visitor.visitor.organization },
  ];

  return (
    <div>
      <div className="animate-fade-in flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Visitor Status</h1>
          <p className="text-muted-foreground mt-1">{visitor.message}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="animate-fade-in">
        <Card>
          <CardContent className="p-6">
            {/* Status badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Approval Status
              </span>
              <Badge className={badgeConfig.className}>{status}</Badge>
            </div>

            {/* Details */}
            <div className="space-y-4">
              {details.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium">{item.value || "N/A"}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/guard/register")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register Another
              </Button>
              <Button
                className="flex-1"
                onClick={handleCheckIn}
                disabled={status !== "Approved"}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Check In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
