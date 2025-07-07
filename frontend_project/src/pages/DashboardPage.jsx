// src/pages/DashboardPage.jsx
import React, { useState, useMemo } from "react";
import {
  BarChart2,
  Users,
  Handshake,
  Banknote,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedMetric, setSelectedMetric] = useState(null);
  const navigate = useNavigate();

  // Демоданные
  const data = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(2025, 6, i + 1).toLocaleDateString("ru-RU");
      return {
        date,
        clients: Math.floor(Math.random() * 5),
        tenders: Math.floor(Math.random() * 3),
        income: 10000 + i * 500,
        debt: i % 4 === 0 ? 10000 + i * 1000 : 0,
      };
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const dDate = new Date(d.date.split(".").reverse().join("-"));
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      return (!from || dDate >= from) && (!to || dDate <= to);
    });
  }, [data, dateFrom, dateTo]);

  const stats = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      label: "Клиенты",
      key: "clients",
      value: filteredData.reduce((sum, d) => sum + d.clients, 0),
    },
    {
      icon: <Handshake className="w-6 h-6 text-green-600" />,
      label: "Закупки",
      key: "tenders",
      value: filteredData.reduce((sum, d) => sum + d.tenders, 0),
    },
    {
      icon: <Banknote className="w-6 h-6 text-yellow-600" />,
      label: "Счета (оплачено)",
      key: "income",
      value: `${filteredData
        .reduce((sum, d) => sum + d.income, 0)
        .toLocaleString()} ₽`,
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      label: "Дебиторка",
      key: "debt",
      value: `${filteredData
        .reduce((sum, d) => sum + d.debt, 0)
        .toLocaleString()} ₽`,
    },
  ];

  const renderDetailTable = () => {
    // Определяем данные для выбранной метрики
    if (selectedMetric === "clients") {
      const rows = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        company: `ООО Клиент ${i + 1}`,
        amount: `${(200000 + i * 5000).toLocaleString()} ₽`,
        date: new Date(2025, 6, i + 1).toLocaleDateString("ru-RU"),
      }));

      return (
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="text-left border-b">
              <th className="py-2 px-3 font-semibold">Компания</th>
              <th className="py-2 px-3 font-semibold">Сумма оплат</th>
              <th className="py-2 px-3 font-semibold">Дата оплаты</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td
                  className="py-2 px-3 whitespace-nowrap text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate(`/company/${row.id}`)}
                >
                  {row.company}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">{row.amount}</td>
                <td className="py-2 px-3 whitespace-nowrap">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedMetric === "tenders") {
      const rows = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        tenderNumber: `2025-${String(i + 1).padStart(3, "0")}`,
        company: `ООО Клиент ${i + 1}`,
        nmck: `${(1000000 + i * 10000).toLocaleString()} ₽`,
        status: i % 2 === 0 ? "Победили" : "Проиграли",
      }));

      return (
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="text-left border-b">
              <th className="py-2 px-3 font-semibold">№ Закупки</th>
              <th className="py-2 px-3 font-semibold">Компания</th>
              <th className="py-2 px-3 font-semibold">НМЦК</th>
              <th className="py-2 px-3 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3 whitespace-nowrap">{row.tenderNumber}</td>
                <td
                  className="py-2 px-3 whitespace-nowrap text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate(`/company/${row.id}`)}
                >
                  {row.company}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">{row.nmck}</td>
                <td className="py-2 px-3 whitespace-nowrap">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedMetric === "income" || selectedMetric === "debt") {
      const rows = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        company: `ООО Клиент ${i + 1}`,
        invoice: `СЧ-${i + 1}`,
        amount: `${(10000 + i * 500).toLocaleString()} ₽`,
        date: new Date(2025, 6, i + 1).toLocaleDateString("ru-RU"),
      }));

      return (
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="text-left border-b">
              <th className="py-2 px-3 font-semibold">Компания</th>
              <th className="py-2 px-3 font-semibold">№ счета</th>
              <th className="py-2 px-3 font-semibold">Сумма</th>
              <th className="py-2 px-3 font-semibold">Дата</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td
                  className="py-2 px-3 whitespace-nowrap text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate(`/company/${row.id}`)}
                >
                  {row.company}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">{row.invoice}</td>
                <td className="py-2 px-3 whitespace-nowrap">{row.amount}</td>
                <td className="py-2 px-3 whitespace-nowrap">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">С даты</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">По дату</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => setSelectedMetric(stat.key)}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow hover:bg-gray-50 transition"
          >
            <div className="flex-shrink-0">{stat.icon}</div>
            <div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-lg font-bold">{stat.value}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex-grow rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">График активности</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="clients" fill="#3b82f6" name="Клиенты" />
            <Bar dataKey="tenders" fill="#22c55e" name="Закупки" />
            <Bar dataKey="income" fill="#f59e0b" name="Доход" />
            <Bar dataKey="debt" fill="#ef4444" name="Дебиторка" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-5xl max-h-[80vh] rounded-xl p-6 relative overflow-hidden flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setSelectedMetric(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">Детализация: {selectedMetric}</h3>
            <div className="overflow-y-auto flex-grow">{renderDetailTable()}</div>
          </div>
        </div>
      )}
    </div>
  );
}