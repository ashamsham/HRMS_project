import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (requiredRole && role.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;
