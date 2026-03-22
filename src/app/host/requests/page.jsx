"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Loader2,
  ClipboardList,
  User,
  Mail,
  FileText,
  Clock,
} from "lucide-react";
import { showToast } from "@/lib/toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function HostRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setRequests(data.pendingVisitors);
      } catch (error) {
        showToast.error("Error", "Failed to fetch pending requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    setActionLoading(`${id}-${action}`);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/visitors/${id}/${action}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(`Failed to ${action}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      showToast.success(
        action === "approve" ? "Approved" : "Rejected",
        `Visitor has been ${action}d`
      );
    } catch (error) {
      showToast.error("Error", `Failed to ${action} visitor`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Pending Requests</h1>
        <p className="text-muted-foreground mt-1">
          {requests.length} visitor{requests.length !== 1 ? "s" : ""} awaiting approval
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="animate-fade-in text-center py-16">
          <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-1">All clear</h3>
          <p className="text-sm text-muted-foreground">
            No pending visitor requests at the moment
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {requests.map((req) => (
              <motion.div
                key={req._id}
                variants={itemVariants}
                exit="exit"
                layout
              >
                <Card className="border border-border hover:border-border/80 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Visitor info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {req.fullName}
                          </h3>
                          <Badge variant="outline" className="shrink-0 text-[10px]">
                            Pending
                          </Badge>
                        </div>
                        <div className="grid gap-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{req.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{req.purpose}</span>
                          </div>
                          {req.scheduledTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span>{new Date(req.scheduledTime).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleAction(req._id, "approve")}
                          disabled={actionLoading === `${req._id}-approve`}
                          className="bg-success hover:bg-success/90"
                        >
                          {actionLoading === `${req._id}-approve` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(req._id, "reject")}
                          disabled={actionLoading === `${req._id}-reject`}
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          {actionLoading === `${req._id}-reject` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
