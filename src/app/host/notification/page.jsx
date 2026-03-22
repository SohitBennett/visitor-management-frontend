"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Mail, Clock, Radio } from "lucide-react";
import { showToast } from "@/lib/toast";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

const itemVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function HostNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("visitorCheckedIn", (data) => {
      setNotifications((prev) => [data, ...prev]);
      showToast.info("Visitor checked in", data.fullName || "A visitor just checked in");
    });

    return () => {
      socket.off("visitorCheckedIn");
    };
  }, []);

  return (
    <div>
      <div className="animate-fade-in mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Real-time visitor check-in alerts
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success">
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="text-xs font-semibold">Live</span>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="animate-fade-in text-center py-16">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No check-ins yet</h3>
          <p className="text-sm text-muted-foreground">
            You&apos;ll see real-time notifications when visitors check in
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, index) => (
              <motion.div
                key={`${notif.email}-${index}`}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                layout
              >
                <Card className="border border-success/20 hover:border-success/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10 shrink-0">
                        <User className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {notif.fullName}
                          </h3>
                          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/10 text-[10px]">
                            Checked In
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{notif.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {new Date(notif.checkInTime).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
