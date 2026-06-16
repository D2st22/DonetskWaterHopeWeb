import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export function RequireAuth({ role, children }) {
  const { user, token } = useApp();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "Admin" ? "/admin" : "/app"} replace />;
  }

  return children;
}
