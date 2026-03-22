"use client";

import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";

const pageTitles = {
  "/guard": "Dashboard",
  "/guard/register": "Register Visitor",
  "/guard/preapproved": "Pre-approved Visitors",
  "/guard/checkout": "Checkout Visitor",
  "/guard/visitor-status": "Visitor Status",
  "/guard/badge": "Visitor Badge",
  "/host": "Dashboard",
  "/host/requests": "Pending Requests",
  "/host/preapprove": "Pre-approve Visitor",
  "/host/notification": "Notifications",
  "/admin": "Visitor Logs",
};

export default function Topbar({ role, collapsed, onMobileOpen }) {
  const pathname = usePathname();

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <header
      className="animate-fade-in sticky top-0 z-30 flex items-center h-16 px-4 sm:px-6 bg-card/80 backdrop-blur-xl border-b border-border"
    >
      {/* Mobile menu button */}
      <button
        onClick={onMobileOpen}
        className="lg:hidden p-2 -ml-2 mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground font-medium">{roleLabel}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <span className="font-semibold text-foreground">{pageTitle}</span>
      </div>

      {/* Right side — role badge */}
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold">{roleLabel}</span>
        </div>
      </div>
    </header>
  );
}
