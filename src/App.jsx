import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth.jsx";
import { useApp } from "./context/AppContext.jsx";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { IotPage } from "./pages/IotPage.jsx";
import { LoginPage } from "./pages/auth/LoginPage.jsx";
import { RegisterPage } from "./pages/auth/RegisterPage.jsx";
import { AdminAlertsPage } from "./pages/admin/AdminAlertsPage.jsx";
import { AdminBackupsPage } from "./pages/admin/AdminBackupsPage.jsx";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage.jsx";
import { AdminDevicesPage } from "./pages/admin/AdminDevicesPage.jsx";
import { AdminLogsPage } from "./pages/admin/AdminLogsPage.jsx";
import { AdminTariffsPage } from "./pages/admin/AdminTariffsPage.jsx";
import { AdminTicketsPage } from "./pages/admin/AdminTicketsPage.jsx";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage.jsx";
import { AlertsPage } from "./pages/user/AlertsPage.jsx";
import { DashboardPage } from "./pages/user/DashboardPage.jsx";
import { DevicesPage } from "./pages/user/DevicesPage.jsx";
import { ProfilePage } from "./pages/user/ProfilePage.jsx";
import { ReadingsPage } from "./pages/user/ReadingsPage.jsx";
import { TicketsPage } from "./pages/user/TicketsPage.jsx";

export default function App() {
  const { user, token } = useApp();
  const home = token && user ? (user.role === "Admin" ? "/admin" : "/app") : "/login";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={home} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/app"
        element={
          <RequireAuth role="User">
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="iot" element={<IotPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="readings" element={<ReadingsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAuth role="Admin">
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="iot" element={<IotPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="devices" element={<AdminDevicesPage />} />
        <Route path="tariffs" element={<AdminTariffsPage />} />
        <Route path="tickets" element={<AdminTicketsPage />} />
        <Route path="alerts" element={<AdminAlertsPage />} />
        <Route path="backups" element={<AdminBackupsPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}
