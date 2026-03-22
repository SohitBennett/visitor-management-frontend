"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Loader2, LogIn } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        showToast.success("Welcome back!", `Signed in as ${data.user.role}`);

        if (data.user.role === "host") router.push("/host");
        else if (data.user.role === "guard") router.push("/guard");
        else if (data.user.role === "admin") router.push("/admin");
        else showToast.error("Unknown role");
      } else {
        showToast.error("Login failed", data.message || "Invalid credentials");
      }
    } catch (err) {
      showToast.error("Connection error", "Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && password) handleLogin();
  };

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
              Streamline your
              <br />
              visitor management
            </h2>
            <p className="text-lg text-white/70 max-w-md font-medium">
              Secure check-ins, real-time notifications, and effortless
              visitor tracking for modern enterprises.
            </p>
          </div>
          <p className="text-xs text-white/40 font-medium">
            Secure. Efficient. Professional.
          </p>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/gatekeeper_logo_alternate.png" alt="GateKeeper" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-semibold tracking-tight">GateKeeper</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 space-y-5">
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
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full h-11 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </CardContent>

            <CardFooter className="p-0 pt-6">
              <p className="text-center text-sm text-muted-foreground w-full font-medium">
                Don&apos;t have an account?{" "}
                <a
                  href="/register"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Create account
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
