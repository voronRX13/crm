import React, { useState } from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const NewsPage = () => {
  const [news, setNews] = useState(
    Array.from({ length: 38 }, (_, i) => ({
      id: i + 1,
      title: `Новость ${i + 1}`,
      type: i % 3 === 0 ? "Важное" : i % 2 === 0 ? "Обновление" : "Новость",
      status: i % 2 === 0 ? "Прочитано" : "Не прочитано",
      author: `Автор ${i + 1}`,
    }))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const paginatedData = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      key: "title",
      label: "Заголовок",
      render: (value, row) => (
        <button
          className="text-blue-500 hover:underline text-left"
          onClick={() => handleEdit(row)}
        >
          {value}
        </button>
      ),
    },
    { key: "type", label: "Тип" },
    {
      key: "status",
      label: "Статус",
      render: (value) => (
        <span
          className={`badge text-xs ${
            value === "Прочитано" ? "badge-success" : "badge-warning"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "author", label: "Автор" },
  ];

  const handleEdit = (newsItem) => {
    console.log("Редактировать:", newsItem);
    setEditingNews(newsItem);
    setShowModal(true);
  };

  const handleDelete = (newsItem) => {
    if (window.confirm("Удалить новость?")) {
      console.log("Удалено:", newsItem);
      setNews((prev) => prev.filter((n) => n.id !== newsItem.id));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowModal(true)}>Добавить новость</Button>
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
        onClose={() => {
          setShowModal(false);
          setEditingNews(null);
        }}
        title={editingNews ? "Редактировать новость" : "Добавить новость"}
      >
        <div className="text-sm">
          Здесь будет форма {editingNews ? "редактирования" : "добавления"} новости.
        </div>
      </Modal>
    </div>
  );
};

export default NewsPage;