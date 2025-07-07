// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token"); // используй тот ключ, который сохраняется в loginService

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}