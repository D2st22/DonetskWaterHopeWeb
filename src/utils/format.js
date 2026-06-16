export function formatDate(value, locale) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatMoney(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

export function fullName(user) {
  return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.accountNumber || "";
}

export function sortByText(items, key, collator) {
  return [...items].sort((a, b) => collator.compare(String(a[key] || ""), String(b[key] || "")));
}

export function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function importSummary(imported) {
  const source = imported?.data || imported || {};
  return {
    version: imported?.version || null,
    exportedAt: imported?.exportedAt || null,
    appSettings: imported?.appSettings || null,
    users: Array.isArray(source.users) ? source.users.length : 0,
    devices: Array.isArray(source.devices) ? source.devices.length : 0,
    tariffs: Array.isArray(source.tariffs) ? source.tariffs.length : 0,
    tickets: Array.isArray(source.tickets) ? source.tickets.length : 0,
    alerts: Array.isArray(source.alerts) ? source.alerts.length : 0,
    logs: Array.isArray(source.logs) ? source.logs.length : 0
  };
}
