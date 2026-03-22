import DashboardShell from "@/components/dashboard-shell";

export default function GuardLayout({ children }) {
  return <DashboardShell role="guard">{children}</DashboardShell>;
}
