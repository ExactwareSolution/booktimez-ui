import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authData = localStorage.getItem("btz_auth");

  let token = null;
  let role = null;
  let isBusinessAvailable = false;

  if (authData) {
    const parsed = JSON.parse(authData);
    token = parsed?.token;
    role = parsed?.user?.role;
    isBusinessAvailable = parsed?.isBusinessAvailable;
  }

  // 🔐 Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ ADMIN: allow everything
  if (role === "admin") {
    return children;
  }

  // 🛑 OWNER without business
  if (
    !isBusinessAvailable &&
    location.pathname !== "/dashboard/create-business"
  ) {
    return <Navigate to="/dashboard/create-business" replace />;
  }

  // 🛑 OWNER trying to access admin pages
  if (location.pathname.startsWith("/dashboard/overview")) {
    return <Navigate to="/dashboard/bookings" replace />;
  }

  return children;
};

export default ProtectedRoute;
