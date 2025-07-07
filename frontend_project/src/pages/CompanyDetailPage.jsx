import React, { useState } from "react";
import Table from "@/components/ui/Table";

const tabs = [
  { key: "company", label: "Компания" },
  { key: "tenders", label: "Закупки" },
  { key: "documents", label: "Документы" },
];

const CompanyDetailPage = () => {
  const [activeTab, setActiveTab] = useState("tenders");

  const tenders = [
    {
      id: "2025-001",
      procedureType: "Аукцион",
      procedureName: "Поставка оборудования",
      nmck: "1 200 000 ₽",
      endDate: "10.08.2025 18:00",
      auctionDate: "15.08.2025",
      resultDate: "18.08.2025",
      winningPrice: "1 150 000 ₽",
      status: "Подали заявку",
      agreement: "Создано",
      signedAgreement: "https://example.com/agreements/2025-001.pdf",
    },
  ];

  const columns = [
    { key: "id", label: "№ процедуры" },
    { key: "procedureType", label: "Вид процедуры" },
    { key: "procedureName", label: "Наименование процедуры" },
    { key: "nmck", label: "НМЦК" },
    { key: "endDate", label: "Окончание подачи" },
    { key: "auctionDate", label: "Дата аукциона" },
    { key: "resultDate", label: "Подведение итогов" },
    { key: "winningPrice", label: "Победная цена" },
    { key: "status", label: "Статус" },
    { key: "agreement", label: "Доп. соглашение" },
    {
      key: "signedAgreement",
      label: "Подписанное доп. соглашение",
      render: (value) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            Скачать
          </a>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
  ];

  return (
    <main className="flex flex-col h-full bg-white rounded-xl border shadow overflow-hidden">
      {/* Вкладки */}
      <div className="flex border-b bg-white sticky top-0 z-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition whitespace-nowrap
              ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div className="flex-grow p-6 overflow-y-auto">
        {activeTab === "company" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-xl shadow p-4 bg-gray-50">
              <h2 className="font-bold text-lg mb-2">Информация о компании</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p>Название: ООО Пример</p>
                <p>ИНН: 7701234567</p>
                <p>Регион: Москва</p>
                <p>Город: Москва</p>
              </div>
            </div>

            <div className="border rounded-xl shadow p-4 bg-gray-50">
              <h2 className="font-bold text-lg mb-2">Контактные лица</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Иванов Иван:</strong> Директор, +7 999 123-45-67, ivanov@example.com</p>
                <p><strong>Сидоров Сергей:</strong> Бухгалтер, +7 999 987-65-43, sidorov@example.com</p>
              </div>
            </div>

            <div className="border rounded-xl shadow p-4 bg-gray-50 md:col-span-1">
              <h2 className="font-bold text-lg mb-2">Реквизиты</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p>Банк: ПАО Сбербанк</p>
                <p>Расчётный счёт: 40702810900000000001</p>
                <p>Корр. счёт: 30101810400000000225</p>
                <p>БИК: 044525225</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tenders" && (
          <div className="space-y-4">
            <div className="flex justify-end mb-2">
              <button
                className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => alert("Создать новую закупку")}
              >
                Новая закупка
              </button>
            </div>
            <Table
              columns={columns}
              data={tenders}
              onEdit={(row) => alert(`Редактировать тендер ${row.id}`)}
              onDelete={(row) => {
                if (window.confirm(`Удалить тендер ${row.id}?`)) {
                  alert(`Тендер ${row.id} удалён (реализуй удаление в бэкенде)`);
                }
              }}
            />
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Документы</h2>
            <p className="text-sm text-gray-700">Список документов будет здесь.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CompanyDetailPage;