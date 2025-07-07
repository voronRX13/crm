import React, { useState } from "react";
import {
  Home, FileText, Newspaper, ContactRound, BarChart2, ChevronDown, ChevronRight,
  LogOut, Users, Handshake, Banknote, FileSpreadsheet, FileBarChart, MessageSquare,
  Settings
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isReportsActive = location.pathname.startsWith("/reports");
  const isSettingsActive = location.pathname.startsWith("/settings");

  const [isReportsOpen, setIsReportsOpen] = useState(isReportsActive);
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);

  const mainLinks = [
    { to: "/dashboard", label: "Главная", icon: <Home className="w-5 h-5" /> },
    { to: "/news", label: "Новости", icon: <Newspaper className="w-5 h-5" /> },
    { to: "/company", label: "Компании", icon: <ContactRound className="w-5 h-5" /> },
    { to: "/tenders", label: "Реестр закупок", icon: <Handshake className="w-5 h-5" /> },
    { to: "/documents", label: "Документы", icon: <FileText className="w-5 h-5" /> },
    { to: "/orders", label: "Счета", icon: <Banknote className="w-5 h-5" /> },
  ];

  const reportsLinks = [
    { to: "/reports/clients", label: "Отчёт по клиентам", icon: <FileSpreadsheet className="w-5 h-5" /> },
    { to: "/reports/tenders", label: "Отчёт по тендерам", icon: <FileText className="w-5 h-5" /> },
    { to: "/reports/finance", label: "Финансовый отчёт", icon: <FileBarChart className="w-5 h-5" /> },
    { to: "/reports/comments", label: "Отчёт по комментариям", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const settingsLinks = [
    { to: "/settings/references", label: "Справочники" },
    // Здесь можно будет добавить другие подменю для настроек
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="h-[calc(100vh-1px)] w-[12rem] bg-white border-r border-t border-gray-200 shadow-xl rounded-xl m-2 flex flex-col justify-between">
      <div>
        <div className="p-4 mb-2">
          <h1 className="text-xl font-semibold text-blue-gray-900">РК ГРУПП</h1>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${isActive ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          {/* Блок "Отчёты" */}
          <button
            type="button"
            onClick={() => setIsReportsOpen(!isReportsOpen)}
            className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg w-full
              ${(isReportsActive || isReportsOpen) ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"}
            `}
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5" />
              Отчёты
            </div>
            {isReportsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isReportsOpen ? "max-h-[500px]" : "max-h-0"}`}>
            <div className="flex flex-col gap-1 ml-6 mt-1 border-l border-gray-200 pl-2">
              {reportsLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all
                    ${isActive ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Блок "Настройки" */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg w-full
              ${(isSettingsActive || isSettingsOpen) ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"}
            `}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              Настройки
            </div>
            {isSettingsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isSettingsOpen ? "max-h-[500px]" : "max-h-0"}`}>
            <div className="flex flex-col gap-1 ml-6 mt-1 border-l border-gray-200 pl-2">
              {settingsLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all
                    ${isActive ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Отдельный пункт "Пользователи" */}
          <NavLink
            key="/users"
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all
              ${isActive ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            <Users className="w-5 h-5" />
            Пользователи
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-2 px-4 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </button>
      </div>
    </aside>
  );
}