import {
  Bell,
  ClipboardList,
  DatabaseBackup,
  Droplets,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  RefreshCw,
  RadioTower,
  Settings,
  Ticket,
  User,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LocaleControls, StatusMessage } from "../components/ui.jsx";
import { useApp } from "../context/AppContext.jsx";
import { fullName } from "../utils/format.js";

export function AppLayout() {
  const { text, lang, user, isAdmin, busy, logout, refreshData } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const nav = isAdmin ? adminNav(text) : userNav(text);
  const current = nav.find((item) => location.pathname.startsWith(item.to)) || nav[0];
  const sectionLabel = isAdmin
    ? lang === "en" ? "System management" : "Керування системою"
    : lang === "en" ? "Water consumption control" : "Контроль водоспоживання";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className={`fixed inset-y-0 z-30 w-[280px] border-r border-slate-200 bg-white p-4 shadow-xl transition lg:static lg:block lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-water-600 text-white">
              <Droplets size={24} />
            </div>
            <div>
              <h1 className="font-bold leading-tight text-water-900">{text.productShort}</h1>
              <p className="text-xs text-slate-500">{isAdmin ? text.adminMode : text.userMode}</p>
            </div>
          </div>
          <button className="btn btn-soft px-2 lg:hidden" type="button" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm">
          <strong className="block truncate text-slate-950">{fullName(user)}</strong>
          <span className="text-slate-600">{user.accountNumber}</span>
        </div>

        <nav className="grid gap-1.5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-water-600 text-white" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden" type="button" onClick={() => setOpen(false)} />}

      <main className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button className="btn btn-soft px-2 lg:hidden" type="button" onClick={() => setOpen(true)}>
                <Menu size={18} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-950">{current.label}</h2>
                <p className="text-xs text-slate-500">{sectionLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-40">
                <LocaleControls />
              </div>
              <button className="btn btn-soft" disabled={busy} type="button" onClick={refreshData}>
                <RefreshCw size={16} />
                {text.refresh}
              </button>
              <button className="btn btn-danger" type="button" onClick={handleLogout}>
                <LogOut size={16} />
                {text.logout}
              </button>
            </div>
          </div>
        </header>

        <section className="p-4 md:p-6">
          <StatusMessage />
          {busy && <div className="mb-4 rounded-lg border border-water-100 bg-water-50 p-3 text-sm text-water-900">{text.loading}</div>}
          <Outlet />
        </section>
      </main>
    </div>
  );
}

function userNav(text) {
  return [
    { to: "/app/dashboard", label: text.dashboard, icon: LayoutDashboard },
    { to: "/app/iot", label: "IoT", icon: RadioTower },
    { to: "/app/devices", label: text.devices, icon: Gauge },
    { to: "/app/readings", label: text.readings, icon: ReceiptText },
    { to: "/app/alerts", label: text.alerts, icon: Bell },
    { to: "/app/tickets", label: text.tickets, icon: Ticket },
    { to: "/app/profile", label: text.profile, icon: User }
  ];
}

function adminNav(text) {
  return [
    { to: "/admin/dashboard", label: text.dashboard, icon: LayoutDashboard },
    { to: "/admin/iot", label: "IoT", icon: RadioTower },
    { to: "/admin/users", label: text.users, icon: Users },
    { to: "/admin/devices", label: text.devices, icon: Gauge },
    { to: "/admin/tariffs", label: text.tariffs, icon: ReceiptText },
    { to: "/admin/tickets", label: text.tickets, icon: Ticket },
    { to: "/admin/alerts", label: text.alerts, icon: Bell },
    { to: "/admin/backups", label: text.backups, icon: DatabaseBackup },
    { to: "/admin/logs", label: text.logs, icon: ClipboardList },
    { to: "/admin/profile", label: text.profile, icon: Settings }
  ];
}
