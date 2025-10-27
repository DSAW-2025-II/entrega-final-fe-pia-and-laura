import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  // Si no hay token ni usuario → redirigir al login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles específicos y el usuario no tiene permiso
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/start" replace />;
  }

  // Si pasa todas las validaciones → renderizar el contenido
  return children;
}
