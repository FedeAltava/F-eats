// src/presentation/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

type Role = "user" | "restaurant";

interface ProtectedRouteProps {
  allowedRole: Role;
  redirectTo?: string;
}


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRole,
  redirectTo
}) => {
  const role = localStorage.getItem("role") as Role | null;

  if (role !== allowedRole) {
    // Si no tiene el permiso correcto, redirigimos
    const target = redirectTo ?? (allowedRole === "user" 
      ? "/login" 
      : "/login-restaurant");
    return <Navigate to={target} replace />;
  }

  // Si el rol coincide, renderizamos las rutas hijas
  return <Outlet />;
};
