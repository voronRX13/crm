import React from "react";
import { useLocation } from "react-router-dom";

const routeTitles = {
  "/dashboard": "Главная",
  "/news": "Новости",
  "/company": "Компании",
  "/documents": "Документы",
  "/reports": "Отчёты",
  "/reports/clients": "Отчёт по клиентам",
  "/reports/tenders": "Отчёт по тендерам",
  "/reports/finance": "Финансовый отчёт",
  "/reports/comments": "Отчёт по комментариям",
  "/users": "Пользователи",
  "/tenders": "Реестр закупок",
  "/orders": "Счета",
  "/settings/references": "Настройки / Справочники",
};

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const title = routeTitles[path] || "";

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border border-gray-200 shadow-xl rounded-xl mt-2 mx-2">
      <h1 className="text-xl font-semibold text-gray-800">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-9 h-9 rounded-full border border-gray-300"
        />
        <span className="text-sm font-medium text-gray-800">Тимофей</span>
      </div>
    </header>
  );
};

export default Header;