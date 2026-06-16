import { AlertTriangle, Gauge, ReceiptText, Ticket } from "lucide-react";
import { EmptyState, Pill } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { fullName } from "../../utils/format.js";

export function DashboardPage() {
  const { data, user, formatMoney, formatDate } = useApp();
  const devices = data.devices || [];
  const records = data.consumption || [];
  const alerts = data.alerts || [];
  const tickets = data.tickets || [];

  const totalDelta = records.reduce((sum, item) => sum + Number(item.delta || 0), 0);
  const totalPay = records.reduce((sum, item) => sum + Number(item.mustToPay || 0), 0);
  const activeAlerts = alerts.filter((item) => !["Resolved", "Closed"].includes(item.status));
  const openTickets = tickets.filter((item) => ["Open", "InProgress"].includes(item.status));
  const activeDevices = devices.filter((item) => item.status === "Active");
  const lastRecord = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-water-700">Особистий кабінет</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Вітаємо, {fullName(user) || "користувачу"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Тут зібрані ваші лічильники, поточне споживання, попередження та звернення до підтримки.
            </p>
          </div>
          {lastRecord && (
            <div className="rounded-lg border border-water-100 bg-water-50 px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-water-700">Останній показник</span>
              <strong className="mt-1 block text-xl text-water-950">{lastRecord.value}</strong>
              <span className="text-sm text-water-800">{formatDate(lastRecord.createdAt)}</span>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric icon={ReceiptText} label="Поточне споживання" value={formatNumber(totalDelta)} subtext="м³ за доступними показниками" tone="water" />
        <DashboardMetric icon={Gauge} label="Активні лічильники" value={`${activeDevices.length}/${devices.length}`} subtext="підключені до кабінету" tone="emerald" />
        <DashboardMetric icon={AlertTriangle} label="Активні події" value={activeAlerts.length} subtext="потребують уваги" tone="amber" />
        <DashboardMetric icon={Ticket} label="Відкриті звернення" value={openTickets.length} subtext={`До сплати: ${formatMoney(totalPay)}`} tone="slate" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Лічильники</h2>
              <p className="text-sm text-slate-500">Стан пристроїв і останні дані по кожному лічильнику.</p>
            </div>
          </div>

          {devices.length ? (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div className="grid grid-cols-[minmax(0,1fr)_120px_110px] bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                <span>Лічильник</span>
                <span>Номер</span>
                <span>Статус</span>
              </div>
              {devices.map((device) => (
                <div className="grid grid-cols-[minmax(0,1fr)_120px_110px] border-t border-slate-100 px-4 py-3 text-sm" key={device.deviceId || device.serialNumber}>
                  <div className="min-w-0">
                    <strong className="block truncate text-slate-900">{device.name || device.type || "Лічильник води"}</strong>
                    <span className="text-slate-500">{device.tariffName || device.type || "Водопостачання"}</span>
                  </div>
                  <span className="truncate text-slate-600">{device.serialNumber || device.deviceSerialNumber || "-"}</span>
                  <Pill value={device.status || "Unknown"} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Лічильників поки немає" description="Коли адміністратор прив’яже лічильник до вашого акаунта, він з’явиться тут." />
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Попередження</h2>
          <p className="mb-4 text-sm text-slate-500">Короткий список подій, які можуть потребувати уваги.</p>
          {activeAlerts.length ? (
            <div className="grid gap-3">
              {activeAlerts.slice(0, 4).map((alert) => (
                <article className="rounded-lg border border-amber-100 bg-amber-50 p-3" key={alert.alertId}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Pill value={alert.type || "Warning"} />
                    <span className="text-xs text-amber-800">{formatDate(alert.createdAt)}</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{alert.messageText || alert.message || "Є подія, яку варто перевірити."}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Активних попереджень немає" description="Якщо система виявить проблему, повідомлення з’явиться тут." />
          )}
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Останні звернення</h2>
        <p className="mb-4 text-sm text-slate-500">Ваші звернення до підтримки та їхній поточний статус.</p>
        {tickets.length ? (
          <div className="grid gap-2">
            {tickets.slice(0, 5).map((ticket) => (
              <article className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between" key={ticket.ticketId}>
                <div>
                  <strong className="block text-slate-900">{ticket.subject || "Звернення"}</strong>
                  <span className="text-sm text-slate-500">{formatDate(ticket.createdAt)}</span>
                </div>
                <Pill value={ticket.status || "Open"} />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Звернень поки немає" description="Якщо виникне питання або проблема, створіть звернення в розділі підтримки." />
        )}
      </section>
    </div>
  );
}

function DashboardMetric({ icon: Icon, label, value, subtext, tone }) {
  const tones = {
    water: "bg-water-50 text-water-800",
    emerald: "bg-emerald-50 text-emerald-800",
    amber: "bg-amber-50 text-amber-800",
    slate: "bg-slate-100 text-slate-700"
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-sm text-slate-500">{label}</span>
          <strong className="mt-1 block text-3xl font-bold text-slate-950">{value}</strong>
          <p className="mt-2 text-xs leading-5 text-slate-500">{subtext}</p>
        </div>
        <div className={`rounded-lg p-2 ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </section>
  );
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("uk-UA", { maximumFractionDigits: 2 });
}
