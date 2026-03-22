"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import { cn } from "@/lib/utils";

export default function DashboardShell({ role, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Auth guard — redirect if no token or wrong role
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (!token) {
      router.push("/login");
      return;
    }
    if (storedRole && storedRole !== role) {
      router.push(`/${storedRole}`);
    }
  }, [role, router]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        role={role}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <Topbar
          role={role}
          collapsed={collapsed}
          onMobileOpen={() => setMobileOpen(true)}
        />

        <main className="animate-fade-in p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
