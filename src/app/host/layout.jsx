import DashboardShell from "@/components/dashboard-shell";

export default function HostLayout({ children }) {
  return <DashboardShell role="host">{children}</DashboardShell>;
}
