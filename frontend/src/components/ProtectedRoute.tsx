import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRole: string;
};

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // admin route → only ADMIN can enter
  if (allowedRole === "ADMIN" && role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  // user route → anyone except ADMIN can enter
  // (GIS Intern, Full Stack Trainee, UI Developer etc. all allowed)
  if (allowedRole === "USER" && role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}