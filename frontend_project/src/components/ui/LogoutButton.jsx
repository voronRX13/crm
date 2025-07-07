// src/components/ui/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ className = "" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // очищаем токен
    navigate("/login", { replace: true });   // перенаправляем на страницу логина
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition ${className}`}
    >
      Выйти
    </button>
  );
}