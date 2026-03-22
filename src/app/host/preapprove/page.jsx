"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  UserCheck,
  Loader2,
  Mail,
  Phone,
  User,
  Building2,
  FileText,
  Calendar,
} from "lucide-react";
import { showToast } from "@/lib/toast";

const fields = [
  { key: "fullName", label: "Full Name", icon: User, placeholder: "John Doe" },
  { key: "email", label: "Email", icon: Mail, placeholder: "visitor@email.com", type: "email" },
  { key: "contactInfo", label: "Phone", icon: Phone, placeholder: "+91 98765 43210" },
  { key: "purpose", label: "Purpose", icon: FileText, placeholder: "Meeting, Interview, etc." },
  { key: "organization", label: "Organization", icon: Building2, placeholder: "Company name" },
  { key: "scheduledTime", label: "Scheduled Time", icon: Calendar, type: "datetime-local" },
];

export default function PreApproveVisitorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactInfo: "",
    purpose: "",
    organization: "",
    scheduledTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/preapprove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        showToast.success("Pre-approved", "Visitor has been pre-approved and QR sent");
        setFormData({
          fullName: "",
          email: "",
          contactInfo: "",
          purpose: "",
          organization: "",
          scheduledTime: "",
        });
      } else {
        showToast.error("Failed", "Could not pre-approve visitor");
      }
    } catch (err) {
      showToast.error("Connection error", "Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Pre-approve Visitor</h1>
        <p className="text-muted-foreground mt-1">
          Schedule and pre-approve a visitor. A QR code will be sent to them.
        </p>
      </div>

      <div className="animate-fade-in">
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div
                    key={field.key}
                    className={`space-y-2 ${field.key === "scheduledTime" ? "sm:col-span-2" : ""}`}
                  >
                    <Label htmlFor={field.key} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={field.key}
                        name={field.key}
                        type={field.type || "text"}
                        placeholder={field.placeholder || ""}
                        value={formData[field.key]}
                        onChange={handleChange}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.fullName || !formData.email}
              className="w-full h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Pre-approve Visitor
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
