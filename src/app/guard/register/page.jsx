"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Loader2,
  Mail,
  Phone,
  User,
  Building2,
  FileText,
  Upload,
  Info,
} from "lucide-react";
import { showToast } from "@/lib/toast";

const fields = [
  { key: "fullName", label: "Full Name", icon: User, placeholder: "John Doe" },
  { key: "email", label: "Email", icon: Mail, placeholder: "visitor@email.com", type: "email" },
  { key: "contactInfo", label: "Phone Number", icon: Phone, placeholder: "+91 98765 43210" },
  { key: "purpose", label: "Purpose of Visit", icon: FileText, placeholder: "Meeting, Interview, etc." },
  { key: "hostEmail", label: "Host Email", icon: Mail, placeholder: "host@company.com", type: "email" },
  { key: "hostDepartment", label: "Host Department", icon: Building2, placeholder: "Engineering, HR, etc." },
  { key: "organization", label: "Organization", icon: Building2, placeholder: "Company name" },
];

export default function RegisterVisitorPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactInfo: "",
    purpose: "",
    hostEmail: "",
    hostDepartment: "",
    organization: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    form.append("photo", photo);
    form.append("preApproved", false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: form,
        }
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("lastRegisteredVisitor", JSON.stringify(data));
        showToast.success("Visitor registered", "Awaiting host approval");
        router.push("/guard/visitor-status");
      } else {
        showToast.error("Registration failed", "Please check all fields");
      }
    } catch (err) {
      showToast.error("Connection error", "Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Register Visitor</h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Enter visitor details to request check-in approval
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form — takes 2/3 */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-sm font-semibold">
                      {field.label}
                    </Label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={field.key}
                        name={field.key}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={formData[field.key]}
                        onChange={handleChange}
                        className="pl-10 h-11 font-medium"
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
              className="w-full sm:w-auto h-11 px-8 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register Visitor
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sidebar — photo upload + tips */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-semibold">Visitor Photo</h3>
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center gap-3 h-48 rounded-lg border-2 border-dashed border-border hover:border-primary/30 hover:bg-accent/30 transition-colors cursor-pointer"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-44 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">Click to upload</span>
                    <span className="text-xs text-muted-foreground">JPG, PNG up to 5MB</span>
                  </div>
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold mb-1">How it works</h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5 font-medium">
                    <li>1. Fill in the visitor&apos;s details</li>
                    <li>2. Host receives an approval request</li>
                    <li>3. Once approved, check in the visitor</li>
                    <li>4. A badge with QR code is generated</li>
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
