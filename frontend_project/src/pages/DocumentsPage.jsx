import React, { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const tabs = [
  { key: "contracts", label: "Договоры" },
  { key: "acts", label: "Акты" },
];

const DocumentsPage = () => {
  const [activeTab, setActiveTab] = useState("contracts");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  const allData = {
    contracts: Array.from({ length: 38 }, (_, i) => ({
      id: i + 1,
      number: `ДГ-${i + 1}`,
      company: `ООО "Компания ${i + 1}"`,
      inn: `7701${(100000 + i).toString().slice(-6)}`,
      status: i % 2 === 0 ? "active" : "draft",
      file: "contract.pdf",
    })),
    acts: Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      number: `АК-${i + 1}`,
      company: `ООО "Акт ${i + 1}"`,
      inn: `7703${(300000 + i).toString().slice(-6)}`,
      status: i % 2 === 0 ? "signed" : "pending",
      file: "act.pdf",
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
    { key: "company", label: "Компания" },
    { key: "inn", label: "ИНН" },
    {
      key: "status",
      label: "Статус",
      render: (value) => (
        <span
          className={`badge text-xs ${
            ["active", "paid", "signed", "valid"].includes(value)
              ? "badge-success"
              : "badge-error"
          }`}
        >
          {value}
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

  const handleEdit = (doc) => {
    console.log("Редактировать:", doc);
    setShowModal(true);
  };

  const handleDelete = (doc) => {
    if (window.confirm("Удалить документ?")) {
      console.log("Удалён:", doc);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setCurrentPage(1);
          }}
        />
        <Button onClick={() => setShowModal(true)}>Добавить документ</Button>
      </div>

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
        title="Добавить документ"
      >
        <div className="text-sm">Форма добавления документа будет тут.</div>
      </Modal>
    </div>
  );
};

export default DocumentsPage;