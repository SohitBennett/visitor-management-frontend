"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const LogsPage = () => {
  const [processedLogs, setProcessedLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch logs: ${res.status} - ${errorText}`);
        }

        const rawLogs = await res.json();

        const visitsMap = {};
        rawLogs.forEach((log) => {
          if (!log.visitor || !log.visitor._id) return;

          const visitorId = log.visitor._id;
          if (!visitsMap[visitorId]) {
            visitsMap[visitorId] = {
              _id: visitorId,
              fullName: log.visitor.fullName,
              checkInTime: log.visitor.checkInTime,
              checkOutTime: log.visitor.checkOutTime,
              lastAction: log.action,
              email: log.visitor.email,
              contactInfo: log.visitor.contactInfo,
            };
          }
          visitsMap[visitorId].lastAction = log.action;
        });

        setProcessedLogs(Object.values(visitsMap));
      } catch (err) {
        console.error("Failed to fetch or process logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [router]);

  const formatToIST = (utcDate) => {
    if (!utcDate) return "\u2014";
    const date = new Date(utcDate);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getActionBadge = (action) => {
    if (!action) return <Badge variant="outline">N/A</Badge>;
    const lower = action.toLowerCase();
    if (lower.includes("check-in") || lower.includes("checkin")) {
      return <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/10">Checked In</Badge>;
    }
    if (lower.includes("check-out") || lower.includes("checkout")) {
      return <Badge variant="secondary">Checked Out</Badge>;
    }
    return <Badge variant="outline">{action}</Badge>;
  };

  const filteredLogs = processedLogs.filter(
    (log) =>
      (log.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Visitor Logs</h1>
        <p className="text-muted-foreground mt-1">
          {processedLogs.length} total records
        </p>
      </div>

      {/* Search */}
      <div className="animate-fade-in mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Visitor
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Check In
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Check Out
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <FileText className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {search ? "No matching records found" : "No visitor logs yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <motion.tr
                      key={log._id}
                      variants={rowVariants}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {log.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.email || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                        {log.contactInfo || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {formatToIST(log.checkInTime)}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {formatToIST(log.checkOutTime)}
                      </td>
                      <td className="py-3 px-4">
                        {getActionBadge(log.lastAction)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
