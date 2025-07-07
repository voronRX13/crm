import React, { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";

const tabs = [
  { key: "issued", label: "Выставленные счета" },
  { key: "paid", label: "Оплаченные счета" },
  { key: "overdue", label: "Просроченные счета" },
];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("issued");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  const allData = {
    issued: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      number: `СЧ-${i + 1}`,
      service: `Услуга №${i + 1}`,
      company: `ООО "Клиент ${i + 1}"`,
      inn: `7705${(500000 + i).toString().slice(-6)}`,
      amount: `${(10000 + i * 500).toLocaleString()} ₽`,
      status: "issued",
      file: "invoice.pdf",
    })),
    paid: Array.from({ length: 8 }, (_, i) => ({
      id: i + 21,
      number: `СЧ-${i + 21}`,
      service: `Услуга №${i + 21}`,
      company: `ООО "Клиент ${i + 21}"`,
      inn: `7705${(500020 + i).toString().slice(-6)}`,
      amount: `${(12000 + i * 600).toLocaleString()} ₽`,
      status: "paid",
      file: "invoice.pdf",
    })),
    overdue: Array.from({ length: 4 }, (_, i) => ({
      id: i + 41,
      number: `СЧ-${i + 41}`,
      service: `Услуга №${i + 41}`,
      company: `ООО "Клиент ${i + 41}"`,
      inn: `7705${(500030 + i).toString().slice(-6)}`,
      amount: `${(11000 + i * 400).toLocaleString()} ₽`,
      status: "overdue",
      file: "invoice.pdf",
    })),
  };

  const currentData = allData[activeTab] || [];
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { key: "number", label: "№ документа" },
    { key: "service", label: "Услуга" },
    { key: "company", label: "Компания" },
    { key: "inn", label: "ИНН" },
    { key: "amount", label: "Сумма" },
    {
      key: "status",
      label: "Статус",
      render: (value) => (
        <span
          className={`badge text-xs ${
            value === "paid"
              ? "badge-success"
              : value === "issued"
              ? "badge-warning"
              : "badge-error"
          }`}
        >
          {{
            issued: "Выставлен",
            paid: "Оплачен",
            overdue: "Просрочен",
          }[value]}
        </span>
      ),
    },
    {
      key: "file",
      label: "Документ",
      render: (value) => (
        <a
          href={`/${value}`}
          className="text-blue-500 hover:underline text-sm"
          download
        >
          Скачать
        </a>
      ),
    },
  ];

  const handleEdit = (order) => {
    console.log("Редактировать:", order);
    setShowModal(true);
  };

  const handleDelete = (order) => {
    if (window.confirm("Удалить счёт?")) {
      console.log("Удалён:", order);
    }
  };

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

      <div className="flex flex-col flex-grow overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex-grow overflow-y-auto">
          <Table
            data={paginatedData}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Добавить счёт"
      >
        <div className="text-sm">Форма добавления счёта будет тут.</div>
      </Modal>
    </div>
  );
};

export default OrdersPage;