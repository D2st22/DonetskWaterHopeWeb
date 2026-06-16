import { Activity, AlertTriangle, Gauge, RadioTower, RefreshCw, Signal, Wifi, WifiOff } from "lucide-react";
import { useEffect } from "react";
import { EmptyState, Pill } from "../components/ui.jsx";
import { useApp } from "../context/AppContext.jsx";

const IOT_ACCOUNT = "WH-0MWXOUI0";

const copy = {
  uk: {
    title: "IoT-лічильник води",
    description: "Показники з ESP32/Wokwi оновлюються через backend і відображаються як актуальний стан лічильника.",
    online: "Онлайн",
    offline: "Офлайн",
    currentReading: "Актуальний показник",
    flow: "Поточний потік",
    sensor: "Сигнал датчика",
    rssi: "Wi-Fi RSSI",
    lastSeen: "Останній сигнал",
    firmware: "Прошивка",
    device: "Лічильник",
    account: "Акаунт пристрою",
    leakage: "Можливе протікання",
    normal: "Стан нормальний",
    howItWorks: "Як це працює",
    howItWorksText: "Ти запускаєш ESP32 у Wokwi з VS Code. Пристрій авторизується, знаходить прив’язаний лічильник, читає потенціометр на GPIO 34 і кожні 5 секунд надсилає live-стан у /api/iot/status. Якщо є потік води, він також надсилає новий показник у /api/consumption. При високому потоці створюється аварійне сповіщення.",
    noStatus: "IoT-пристрій ще не передав live-стан",
    noStatusText: "Запусти Wokwi Simulator у VS Code. Якщо статус не з’явиться, перевір, що backend задеплоєний з /api/iot/status і до WH-0MWXOUI0 прив’язаний хоча б один лічильник.",
    history: "Історія показників",
    noReadings: "Показників ще немає",
    alerts: "Аварійні події",
    noAlerts: "Аварійних подій немає",
    value: "Показник",
    delta: "Приріст",
    refresh: "Оновити"
  },
  en: {
    title: "IoT water meter",
    description: "ESP32/Wokwi readings are sent through the backend and displayed as the current meter state.",
    online: "Online",
    offline: "Offline",
    currentReading: "Current reading",
    flow: "Current flow",
    sensor: "Sensor signal",
    rssi: "Wi-Fi RSSI",
    lastSeen: "Last signal",
    firmware: "Firmware",
    device: "Meter",
    account: "Device account",
    leakage: "Possible leakage",
    normal: "Normal state",
    howItWorks: "How it works",
    howItWorksText: "You run ESP32 in Wokwi from VS Code. The device signs in, discovers the linked meter, reads the GPIO 34 potentiometer and sends live status to /api/iot/status every 5 seconds. If water is flowing, it also sends a new reading to /api/consumption. High flow creates an emergency alert.",
    noStatus: "The IoT device has not sent live status yet",
    noStatusText: "Start Wokwi Simulator in VS Code. If status does not appear, check that the backend is deployed with /api/iot/status and at least one meter is linked to WH-0MWXOUI0.",
    history: "Reading history",
    noReadings: "No readings yet",
    alerts: "Emergency events",
    noAlerts: "No emergency events",
    value: "Value",
    delta: "Delta",
    refresh: "Refresh"
  }
};

export function IotPage() {
  const { data, isAdmin, lang, busy, formatDate, refreshData } = useApp();
  const t = copy[lang] || copy.uk;
  const devices = isAdmin ? data.adminDevices || [] : data.devices || [];
  const readings = data.consumption || [];
  const alerts = isAdmin ? data.adminAlerts || [] : data.alerts || [];
  const statuses = data.iotStatuses || [];
  const status = statuses[0];
  const device = devices.find((item) => Number(item.deviceId) === Number(status?.deviceId)) || devices[0];
  const serial = status?.serialNumber || device?.serialNumber;
  const deviceReadings = serial ? readings.filter((item) => item.deviceSerialNumber === serial) : readings;
  const latestReading = deviceReadings[0];
  const currentReading = status?.totalCounter ?? latestReading?.value ?? "-";
  const deviceAlerts = serial
    ? alerts.filter((item) => item.deviceSerialNumber === serial)
    : alerts.filter((item) => ["Critical", "Leakage"].includes(item.type));
  const isOnline = Boolean(status?.isOnline);

  useEffect(() => {
    const timer = window.setInterval(() => {
      refreshData().catch(() => {});
    }, 5000);
    return () => window.clearInterval(timer);
  }, [refreshData]);

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-water-700">ESP32 / Wokwi</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{t.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{t.description}</p>
          </div>
          <button className="btn btn-soft" disabled={busy} type="button" onClick={refreshData}>
            <RefreshCw size={16} />
            {t.refresh}
          </button>
        </div>
      </section>

      <section className={`rounded-lg border p-5 shadow-sm md:p-6 ${status?.leakageDetected ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${isOnline ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                {isOnline ? <Wifi size={17} /> : <WifiOff size={17} />}
                {isOnline ? t.online : t.offline}
              </span>
              {status?.leakageDetected && (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                  <AlertTriangle size={17} />
                  {t.leakage}
                </span>
              )}
            </div>

            {status || latestReading ? (
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.currentReading}</span>
                <div className="mt-3 flex items-end gap-3">
                  <strong className="text-6xl font-bold tracking-tight text-water-900">{currentReading}</strong>
                  <span className="pb-2 text-lg font-semibold text-slate-500">L</span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <Info label={t.flow} value={`${status?.flowRate ?? 0} L`} />
                  <Info label={t.lastSeen} value={status?.lastSeenAt ? formatDate(status.lastSeenAt) : "-"} />
                  <Info label={t.device} value={device?.name || serial || "-"} />
                </div>
              </div>
            ) : (
              <EmptyState title={t.noStatus} description={t.noStatusText} />
            )}
          </div>

          <div className="grid content-start gap-3">
            <Metric icon={Signal} label={t.sensor} value={status?.rawSensorValue ?? "-"} />
            <Metric icon={RadioTower} label={t.rssi} value={status?.wifiRssi ? `${status.wifiRssi} dBm` : "-"} />
            <Metric icon={Activity} label={t.firmware} value={status?.firmwareVersion || "-"} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">{t.howItWorks}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t.howItWorksText}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Info label={t.account} value={status?.accountNumber || IOT_ACCOUNT} />
          <Info label="API status" value="/api/iot/status" />
          <Info label="API readings" value="/api/consumption" />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">{t.history}</h2>
          {deviceReadings.length ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              {deviceReadings.slice(0, 8).map((record) => (
                <div className="grid gap-2 border-t border-slate-100 px-4 py-3 text-sm first:border-t-0 md:grid-cols-[1fr_110px_110px_170px]" key={record.recordId}>
                  <span className="font-medium text-slate-900">{record.deviceSerialNumber || serial || "-"}</span>
                  <span className="text-slate-600">{t.value}: {record.value}</span>
                  <span className="text-slate-600">{t.delta}: {record.delta || 0}</span>
                  <span className="text-slate-500">{formatDate(record.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title={t.noReadings} />
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">{t.alerts}</h2>
          <div className="mt-4 grid gap-3">
            {deviceAlerts.length ? deviceAlerts.slice(0, 5).map((alert) => (
              <article className="rounded-lg border border-amber-100 bg-amber-50 p-3" key={alert.alertId}>
                <div className="flex items-center justify-between gap-2">
                  <Pill value={alert.type || "Critical"} />
                  <span className="text-xs text-amber-800">{formatDate(alert.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{alert.messageText || alert.message || "-"}</p>
              </article>
            )) : (
              <EmptyState title={t.noAlerts} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-water-50 text-water-700">
        <Icon size={20} />
      </div>
      <span className="text-sm text-slate-500">{label}</span>
      <strong className="mt-1 block break-words text-lg text-slate-950">{value}</strong>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="block text-xs text-slate-500">{label}</span>
      <strong className="mt-1 block break-words text-slate-950">{value}</strong>
    </div>
  );
}
