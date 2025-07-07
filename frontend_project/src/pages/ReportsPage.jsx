import React, { useState, useMemo } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";

const tabs = [
  { key: "companies", label: "По компаниям" },
  { key: "tenders", label: "По закупкам" },
  { key: "comments", label: "По комментариям" },
];

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const companiesData = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `Компания ${i + 1}`,
    tenders: 2 + i,
    contracts: 1 + i,
    revenue: `${(1200000 + i * 50000).toLocaleString()} ₽`,
  }));

  const tendersData = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    number: `2025-${String(i + 1).padStart(3, "0")}`,
    date: "10.08.2025",
    company: `ООО Клиент ${i + 1}`,
    status: i % 2 === 0 ? "Победили" : "Проиграли",
    amount: `${(500000 + i * 50000).toLocaleString()} ₽`,
  }));

  const commentsData = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    date: `2025-08-${String(i + 1).padStart(2, "0")}`,
    comments: 5 + i,
  }));

  const currentData = useMemo(() => {
    switch (activeTab) {
      case "companies":
        return companiesData;
      case "tenders":
        return tendersData;
      case "comments":
        return commentsData;
      default:
        return [];
    }
  }, [activeTab]);

  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentColumns =
    activeTab === "companies"
      ? [
          { key: "name", label: "Компания" },
          { key: "tenders", label: "Закупки" },
          { key: "contracts", label: "Договоры" },
          { key: "revenue", label: "Сумма контрактов" },
        ]
      : activeTab === "tenders"
      ? [
          { key: "number", label: "№ закупки" },
          { key: "date", label: "Дата" },
          { key: "company", label: "Компания" },
          { key: "status", label: "Статус" },
          { key: "amount", label: "Сумма" },
        ]
      : [
          { key: "date", label: "Дата" },
          { key: "comments", label: "Кол-во комментариев" },
        ];

  return (
    <div className="flex flex-col h-full">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setCurrentPage(1);
        }}
      />

      <div className="flex flex-col flex-grow overflow-hidden rounded-xl border border-gray-200 bg-white mx-6 mb-6">
        <div className="flex-grow overflow-y-auto">
          <Table
            data={paginatedData}
            columns={currentColumns}
            onEdit={(row) => console.log("Редактировать:", row)}
            onDelete={(row) => {
              if (window.confirm("Удалить запись?")) {
                console.log("Удалено:", row);
              }
            }}
          />
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

export default ReportsPage;