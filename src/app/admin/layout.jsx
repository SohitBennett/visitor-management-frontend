import DashboardShell from "@/components/dashboard-shell";

export default function AdminLayout({ children }) {
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
