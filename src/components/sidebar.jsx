"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserPlus,
  ClipboardCheck,
  QrCode,
  ClipboardList,
  UserCheck,
  Bell,
  FileText,
  LogOut,
  ChevronLeft,
  Shield,
  Building2,
  X,
} from "lucide-react";

const navConfig = {
  guard: {
    label: "Guard",
    icon: Shield,
    items: [
      { label: "Dashboard", href: "/guard", icon: LayoutDashboard },
      { label: "Register Visitor", href: "/guard/register", icon: UserPlus },
      { label: "Pre-approved", href: "/guard/preapproved", icon: ClipboardCheck },
      { label: "Checkout", href: "/guard/checkout", icon: QrCode },
    ],
  },
  host: {
    label: "Host",
    icon: Building2,
    items: [
      { label: "Dashboard", href: "/host", icon: LayoutDashboard },
      { label: "Pending Requests", href: "/host/requests", icon: ClipboardList },
      { label: "Pre-approve", href: "/host/preapprove", icon: UserCheck },
      { label: "Notifications", href: "/host/notification", icon: Bell },
    ],
  },
  admin: {
    label: "Admin",
    icon: Shield,
    items: [
      { label: "Visitor Logs", href: "/admin", icon: FileText },
    ],
  },
};

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: -280,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Sidebar({ role, collapsed, onCollapse, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const config = navConfig[role];

  if (!config) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    sessionStorage.clear();
    router.push("/login");
  };

  const handleNavClick = (href) => {
    router.push(href);
    if (mobileOpen) onMobileClose();
  };

  const isActive = (href) => {
    if (href === `/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  const RoleIcon = config.icon;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border shrink-0">
        <img src="/gatekeeper_logo_alternate.png" alt="GateKeeper" className="w-8 h-8 rounded-lg shrink-0" />
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight">
              GateKeeper
            </span>
            <span className="text-[10px] text-sidebar-foreground uppercase tracking-widest">
              {config.label} Portal
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <p className={cn(
          "px-3 mb-2 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground",
          collapsed && "text-center"
        )}>
          {collapsed ? "Nav" : "Navigation"}
        </p>
        {config.items.map((item, i) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <motion.button
              key={item.href}
              custom={i}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md shadow-sidebar-accent/20"
                  : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-[18px] h-[18px] shrink-0 transition-colors",
                active ? "text-sidebar-accent-foreground" : "text-sidebar-foreground group-hover:text-white"
              )} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {active && !collapsed && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-accent-foreground"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1 shrink-0">
        {/* Collapse toggle — desktop only */}
        <button
          onClick={onCollapse}
          className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-muted hover:text-white transition-colors"
        >
          <ChevronLeft className={cn(
            "w-[18px] h-[18px] shrink-0 transition-transform duration-300",
            collapsed && "rotate-180"
          )} />
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-sidebar border-r border-sidebar-border"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-sidebar border-r border-sidebar-border lg:hidden"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 p-1 rounded-md text-sidebar-foreground hover:text-white hover:bg-sidebar-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
