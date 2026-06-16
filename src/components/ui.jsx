import { AlertCircle, CheckCircle2, Globe2 } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

export function StatusMessage() {
  const { message } = useApp();
  if (!message) return null;
  const isError = message.startsWith("!");
  const Icon = isError ? AlertCircle : CheckCircle2;
  return (
    <div className={`mb-4 flex gap-2 rounded-lg border p-3 text-sm ${isError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
      <Icon className="mt-0.5 shrink-0" size={17} />
      <span>{message.replace(/^!/, "")}</span>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export function MetricCard({ label, value, subtext, icon: Icon }) {
  return (
    <section className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <strong className="block text-3xl font-bold text-water-900">{value}</strong>
          <span className="text-sm text-slate-500">{label}</span>
          {subtext && <p className="mt-2 text-xs text-slate-500">{subtext}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-water-50 p-2 text-water-700">
            <Icon size={22} />
          </div>
        )}
      </div>
    </section>
  );
}

export function DataTable({ headers, children, emptyText }) {
  const rows = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];
  if (!rows.length) return <EmptyState title={emptyText} />;
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            {headers.map((header, index) => (
              <th key={`${header}-${index}`} className="border-b border-slate-200 px-3 py-2 text-start font-bold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "" }) {
  return <td className={`border-b border-slate-100 px-3 py-2 align-top ${className}`}>{children}</td>;
}

export function Pill({ value }) {
  const normalized = String(value || "").toLowerCase();
  const tone = ["active", "resolved", "closed", "user", "info"].includes(normalized)
    ? "bg-emerald-100 text-emerald-700"
    : ["critical", "leakage", "blocked", "open"].includes(normalized)
      ? "bg-red-100 text-red-700"
      : ["warning", "inprogress", "maintenance", "admin"].includes(normalized)
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-700";
  return <span className={`pill ${tone}`}>{value}</span>;
}

export function LocaleControls() {
  const { lang, setLang } = useApp();
  return (
    <Field label={<span className="inline-flex items-center gap-1"><Globe2 size={14} />{lang === "en" ? "Language" : "Мова"}</span>}>
      <select className="input" value={lang} onChange={(event) => setLang(event.target.value)}>
        <option value="uk">Українська</option>
        <option value="en">English</option>
      </select>
    </Field>
  );
}
