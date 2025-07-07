import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/Layout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import NewsPage from "@/pages/NewsPage";
import DocumentsPage from "@/pages/DocumentsPage";
import ReportsPage from "@/pages/ReportsPage";
import CompanyPage from "@/pages/CompanyPage";
import CompanyDetailPage from "@/pages/CompanyDetailPage";
import TendersPage from "@/pages/TendersPage";
import OrdersPage from "@/pages/OrdersPage";
import ReportsClientsPage from "@/pages/reports/ReportsClientsPage";
import ReportsTendersPage from "@/pages/reports/ReportsTendersPage";
import ReportsFinancePage from "@/pages/reports/ReportsFinancePage";
import ReportsCommentsPage from "@/pages/reports/ReportsCommentsPage";
import ReferencesPage from "@/pages/settings/ReferencesPage"; // ✅ добавили справочники

export default function App() {
  return (
    <Routes>
      {/* Страница логина вне Layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Все остальные страницы — через Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="tenders" element={<TendersPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="reports" element={<ReportsPage />} />

        <Route path="company" element={<CompanyPage />} />
        <Route path="company/:id" element={<CompanyDetailPage />} />

        <Route path="orders" element={<OrdersPage />} />

        {/* Отчёты с вложенными путями */}
        <Route path="reports/clients" element={<ReportsClientsPage />} />
        <Route path="reports/tenders" element={<ReportsTendersPage />} />
        <Route path="reports/finance" element={<ReportsFinancePage />} />
        <Route path="reports/comments" element={<ReportsCommentsPage />} />

        {/* ✅ Настройки и справочники */}
        <Route path="settings/references" element={<ReferencesPage />} />

        {/* 404 для всех неизвестных маршрутов */}
        <Route path="*" element={<div className="p-4">404 — Страница не найдена</div>} />
      </Route>
    </Routes>
  );
}