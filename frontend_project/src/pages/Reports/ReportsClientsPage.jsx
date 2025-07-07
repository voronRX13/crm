import React, { useState, useMemo } from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ReportsClientsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const itemsPerPage = 10;

  const clients = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        company: `Компания ${i + 1}`,
        tenders: 5 + i,
        contracts: 2 + i,
        revenue: `${(500000 + i * 10000).toLocaleString()} ₽`,
        createdAt: new Date(2025, 6, i + 1).toLocaleDateString("ru-RU"),
      })),
    []
  );

  const filteredClients = useMemo(() => {
    return clients.filter((item) => {
      const itemDate = new Date(item.createdAt.split(".").reverse().join("-"));
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      return (!from || itemDate >= from) && (!to || itemDate <= to);
    });
  }, [clients, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedData = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { key: "company", label: "Компания" },
    { key: "tenders", label: "Количество закупок" },
    { key: "contracts", label: "Договоры" },
    { key: "revenue", label: "Сумма контрактов" },
    { key: "createdAt", label: "Дата создания" },
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredClients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Отчёт по клиентам");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `clients-report-${Date.now()}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-2 items-end mb-4">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">С</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm w-36"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">По</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm w-36"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          Экспорт в Excel
        </button>
      </div>

      <div className="flex flex-col flex-grow overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex-grow overflow-y-auto">
          <Table data={paginatedData} columns={columns} />
        </div>
        <div className="border-t border-gray-200 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsClientsPage;