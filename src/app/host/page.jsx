"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  UserCheck,
  Bell,
  ArrowRight,
  Loader2,
} from "lucide-react";

const actions = [
  {
    title: "Pending Requests",
    description: "View and approve or reject visitor requests",
    icon: ClipboardList,
    href: "/host/requests",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Pre-approve Visitor",
    description: "Schedule and pre-approve upcoming visitors",
    icon: UserCheck,
    href: "/host/preapprove",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Notifications",
    description: "Real-time alerts when visitors check in",
    icon: Bell,
    href: "/host/notification",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HostDashboard() {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHostData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const hostId = payload.id;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/status/${hostId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Host data fetch failed");

        const data = await res.json();
        setHost(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-fade-in mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{host?.name ? `, ${host.name}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          {host?.email && (
            <span className="font-mono text-sm">{host.email}</span>
          )}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div key={action.href} variants={itemVariants}>
              <Card
                className="group cursor-pointer border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-6">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${action.bg} mb-4`}
                  >
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
