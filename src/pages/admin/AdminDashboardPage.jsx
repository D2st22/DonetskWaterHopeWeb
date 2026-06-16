import { AlertTriangle, DatabaseBackup, Gauge, Ticket, Users } from "lucide-react";
import { MetricCard, PageHeader } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function AdminDashboardPage() {
  const { data, text } = useApp();
  const users = data.users || [];
  const devices = data.adminDevices || [];
  const tickets = data.adminTickets || [];
  const alerts = data.adminAlerts || [];

  return (
    <div>
      <PageHeader title={text.adminPanel} description={text.adminHelpText} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={Users} label={text.users} value={users.length} />
        <MetricCard icon={Gauge} label={text.activeDevices} value={devices.filter((item) => item.status === "Active").length} />
        <MetricCard icon={Ticket} label={text.openTickets} value={tickets.filter((item) => ["Open", "InProgress"].includes(item.status)).length} />
        <MetricCard icon={AlertTriangle} label={text.criticalAlerts} value={alerts.filter((item) => ["Critical", "Leakage"].includes(item.type)).length} />
        <MetricCard icon={DatabaseBackup} label={text.tariffs} value={(data.tariffs || []).length} />
      </div>
    </div>
  );
}
