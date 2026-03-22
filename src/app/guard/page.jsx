"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserPlus,
  ClipboardCheck,
  QrCode,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Register Visitor",
    description: "Register a new walk-in visitor and notify the host",
    icon: UserPlus,
    href: "/guard/register",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Pre-approved Visitors",
    description: "View and check in pre-approved visitors",
    icon: ClipboardCheck,
    href: "/guard/preapproved",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Checkout Visitor",
    description: "Scan QR code to check out a visitor",
    icon: QrCode,
    href: "/guard/checkout",
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

export default function GuardHome() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-fade-in mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          What would you like to do today?
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
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${action.bg} mb-4`}>
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
