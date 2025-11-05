import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  // 🔒 Si no hay sesión activa → redirigir al login
  if (!isAuthenticated || !user) {
    return <Navigate to="/start" replace />;
  }

  // 🔑 Si hay roles específicos y el usuario no tiene permiso → redirigir a inicio
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/start" replace />;
  }

  // ✅ Si pasa todas las validaciones, renderiza el contenido protegido
  return children;
}
