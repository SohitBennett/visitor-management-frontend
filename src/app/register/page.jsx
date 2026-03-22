"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
  Loader2,
  Shield,
  Building2,
} from "lucide-react";
import { showToast } from "@/lib/toast";

const roles = [
  {
    value: "guard",
    label: "Guard",
    description: "Security & monitoring access",
    icon: Shield,
  },
  {
    value: "host",
    label: "Employee",
    description: "Hosting & approval privileges",
    icon: Building2,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Full system management",
    icon: Shield,
  },
];

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "guard",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast.success("Account created!", "You can now sign in");
        router.push("/login");
      } else {
        showToast.error("Registration failed", data.message || "Please try again");
      }
    } catch (err) {
      showToast.error("Connection error", "Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && form.name && form.email && form.password) handleSubmit();
  };

  const selectedRole = roles.find((r) => r.value === form.role);
  const SelectedIcon = selectedRole?.icon;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Branding panel with image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/gatekeeper_left_panel.png"
          alt="GateKeeper"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <img src="/gatekeeper_logo_alternate.png" alt="GateKeeper" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-semibold tracking-tight">GateKeeper</span>
          </div>
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold tracking-tight leading-tight mb-4">
              Join your team&apos;s
              <br />
              visitor platform
            </h2>
            <p className="text-lg text-white/70 max-w-md font-medium">
              Set up your account in seconds and start managing visitors
              with enterprise-grade security.
            </p>
          </div>
          <p className="text-xs text-white/40 font-medium">
            Secure. Efficient. Professional.
          </p>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="animate-fade-in w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/gatekeeper_logo_alternate.png" alt="GateKeeper" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-semibold tracking-tight">GateKeeper</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Fill in your details to get started
            </p>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    className="pl-10 h-11 font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    className="pl-10 h-11 font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a secure password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    className="pl-10 pr-10 h-11 font-medium"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Role</Label>
                <Select value={form.role} onValueChange={handleRoleChange} disabled={isLoading}>
                  <SelectTrigger className="h-11 font-medium">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{role.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Selected role info */}
                {selectedRole && SelectedIcon && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-accent animate-fade-in">
                    <SelectedIcon className="w-4 h-4 text-accent-foreground" />
                    <div>
                      <p className="text-sm font-semibold">{selectedRole.label}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {selectedRole.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !form.name || !form.email || !form.password}
                className="w-full h-11 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </CardContent>

            <CardFooter className="p-0 pt-6">
              <p className="text-center text-sm text-muted-foreground w-full font-medium">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
