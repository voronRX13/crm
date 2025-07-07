import React, { useState, useEffect } from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getTenders, createTender, updateTender, deleteTender } from "@/services/tenderService";
import { getCompanies } from "@/services/companyService";

const defaultTender = {
  lot_number: "",
  lot_link: "",
  nmck: "",
  deadline: "",
  auction_date: "",
  submitted: false,
  company_id: "",
};

const TendersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tenders, setTenders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newTender, setNewTender] = useState(defaultTender);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tenders.length / itemsPerPage);
  const paginatedData = tenders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    fetchTenders();
    fetchCompanies();
  }, []);

  const fetchTenders = async () => {
    try {
      const data = await getTenders();
      setTenders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка загрузки тендеров:", err);
      setTenders([]);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка загрузки компаний:", err);
    }
  };

  const handleEdit = (tender) => {
    setNewTender({
      id: tender.id,
      lot_number: tender.lot_number || "",
      lot_link: tender.lot_link || "",
      nmck: tender.nmck || "",
      deadline: tender.deadline ? tender.deadline.split("T")[0] : "",
      auction_date: tender.auction_date ? tender.auction_date.split("T")[0] : "",
      submitted: tender.submitted || false,
      company_id: tender.company_id || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (tender) => {
    if (window.confirm(`Удалить закупку "${tender.lot_number}"?`)) {
      try {
        await deleteTender(tender.id);
        fetchTenders();
        alert("Закупка удалена");
      } catch (err) {
        console.error("Ошибка при удалении закупки:", err);
        alert("Не удалось удалить закупку");
      }
    }
  };

  const handleSaveTender = async () => {
  if (!newTender.lot_number) {
    alert("Заполните поле № закупки");
    return;
  }
  if (!newTender.lot_link) {
    alert("Заполните поле Ссылка на документацию");
    return;
  }
  if (!newTender.nmck) {
    alert("Заполните поле НМЦК");
    return;
  }
  if (!newTender.company_id) {
    alert("Выберите компанию");
    return;
  }

  setLoading(true);
  try {
    if (newTender.id) {
      await updateTender(newTender.id, newTender);
      alert("Закупка обновлена");
    } else {
      await createTender(newTender);
      alert("Закупка создана");
    }
    setShowModal(false);
    fetchTenders();
    setNewTender(defaultTender);
  } catch (err) {
    console.error("Ошибка при сохранении закупки:", err);
    alert(`Ошибка: ${err?.response?.data?.detail || err.message}`);
  } finally {
    setLoading(false);
  }


    setLoading(true);
    try {
      const payload = {
        ...newTender,
        deadline: newTender.deadline ? new Date(newTender.deadline).toISOString() : null,
        auction_date: newTender.auction_date ? new Date(newTender.auction_date).toISOString() : null,
      };

      if (newTender.id) {
        await updateTender(newTender.id, payload);
        alert("Закупка обновлена");
      } else {
        await createTender(payload);
        alert("Закупка создана");
      }
      setShowModal(false);
      fetchTenders();
      setNewTender(defaultTender);
    } catch (err) {
      console.error("Ошибка при сохранении закупки:", err);
      alert(`Ошибка: ${err?.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "lot_number", label: "№ закупки" },
    {
      key: "lot_link",
      label: "Документация по лоту",
      render: (_, row) => (
        <a
          href={row.lot_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline visited:text-blue-500"
        >
          Ссылка
        </a>
      ),
    },
    { key: "nmck", label: "НМЦК" },
    {
      key: "deadline",
      label: "Дата окончания подачи",
      render: (val) => val ? new Date(val).toLocaleDateString("ru-RU") : "",
    },
    {
      key: "auction_date",
      label: "Дата аукциона",
      render: (val) => val ? new Date(val).toLocaleDateString("ru-RU") : "",
    },
    {
      key: "docs",
      label: "Документы",
      render: (_, row) => (
        <button
          className="text-blue-500 underline hover:text-blue-700"
          onClick={() => alert(`Здесь откроется модалка для документов лота ${row.lot_number}`)}
        >
          Открыть
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setNewTender(defaultTender); setShowModal(true); }}>
          Добавить закупку
        </Button>
      </div>

      <div className="flex flex-col flex-grow overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex-grow overflow-y-auto">
          <Table data={paginatedData} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
        <div className="border-t border-gray-200 bg-white">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setNewTender(defaultTender);
        }}
        title={newTender.id ? "Редактировать лот" : "Добавить лот"}
      >
        <div className="flex flex-col gap-2 text-sm">
          <input
            className="border p-2 rounded"
            placeholder="№ закупки"
            value={newTender.lot_number || ""}
            onChange={(e) =>
              setNewTender((prev) => ({ ...prev, lot_number: e.target.value }))
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Ссылка на документацию"
            value={newTender.lot_link || ""}
            onChange={(e) =>
              setNewTender((prev) => ({ ...prev, lot_link: e.target.value }))
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="НМЦК"
            value={newTender.nmck || ""}
            onChange={(e) =>
              setNewTender((prev) => ({ ...prev, nmck: e.target.value }))
            }
          />
          <label className="flex flex-col">
            <span className="mb-1 text-gray-600 text-xs">Дата окончания подачи заявки</span>
            <input
              className="border p-2 rounded text-sm"
              type="date"
              value={newTender.deadline || ""}
              onChange={(e) =>
                setNewTender((prev) => ({ ...prev, deadline: e.target.value }))
              }
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-gray-600 text-xs">Дата аукциона</span>
            <input
              className="border p-2 rounded text-sm"
              type="date"
              value={newTender.auction_date || ""}
              onChange={(e) =>
                setNewTender((prev) => ({ ...prev, auction_date: e.target.value }))
              }
            />
          </label>

          <select
            className="border p-2 rounded"
            value={newTender.company_id || ""}
            onChange={(e) =>
              setNewTender((prev) => ({ ...prev, company_id: parseInt(e.target.value) }))
            }
          >
            <option value="" disabled>Выберите компанию</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name || `Компания #${company.id}`}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={newTender.submitted ? "yes" : "no"}
            onChange={(e) =>
              setNewTender((prev) => ({
                ...prev,
                submitted: e.target.value === "yes",
              }))
            }
          >
            <option value="no">Заявка не подана</option>
            <option value="yes">Заявка подана</option>
          </select>

          <Button
            onClick={handleSaveTender}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TendersPage;