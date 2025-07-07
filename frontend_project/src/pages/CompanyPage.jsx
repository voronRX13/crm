import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import api from "@/utils/api";
import { getCompanies, createCompany, updateCompany, deleteCompany } from "@/services/companyService";

const defaultCompany = {
  name: "",
  inn: "",
  industry_id: null,
  region_id: null,
  city_id: null,
  responsible_id: null,
  priority: "",
};

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCompany, setNewCompany] = useState(defaultCompany);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const paginatedData = companies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    fetchCompanies();
    api.get("/references/industry").then((res) => setIndustries(res.data));
    api.get("/references/priority").then((res) => setPriorities(res.data));
    api.get("/regions").then((res) => setRegions(res.data));
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  useEffect(() => {
    if (selectedRegionId) {
      api.get(`/regions/${selectedRegionId}/cities`).then((res) => setCities(res.data));
    } else {
      setCities([]);
    }
  }, [selectedRegionId]);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка загрузки компаний:", err);
      setCompanies([]);
    }
  };

  const handleEdit = (company) => {
    setNewCompany({
      id: company.id,
      name: company.name || "",
      inn: company.inn || "",
      industry_id: company.industry_id || null,
      region_id: company.region_id || null,
      city_id: company.city_id || null,
      responsible_id: company.responsible_id || null,
      priority: company.priority || "",
    });
    setSelectedRegionId(company.region_id || null);
    setShowModal(true);
  };

  const handleDelete = async (company) => {
    if (window.confirm(`Удалить компанию "${company.name}"?`)) {
      try {
        await deleteCompany(company.id);
        fetchCompanies();
        alert("Компания удалена");
      } catch (err) {
        console.error("Ошибка при удалении компании:", err);
        alert("Не удалось удалить компанию");
      }
    }
  };

  const handleSaveCompany = async () => {
    if (!newCompany.name || !newCompany.inn) {
      alert("Заполните обязательные поля: Название и ИНН");
      return;
    }
    setLoading(true);
    try {
      if (!newCompany.id) {
        // ставим ответственного автоматически при создании
        const currentUserId = parseInt(localStorage.getItem("user_id"));
        newCompany.responsible_id = currentUserId || null;
      }
      if (newCompany.id) {
        await updateCompany(newCompany.id, newCompany);
        alert("Компания обновлена");
      } else {
        await createCompany(newCompany);
        alert("Компания создана");
      }
      setShowModal(false);
      fetchCompanies();
      setNewCompany(defaultCompany);
    } catch (err) {
      console.error("Ошибка при сохранении компании:", err);
      alert(`Ошибка: ${err?.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "name", label: "Компания" },
    { key: "inn", label: "ИНН" },
    { key: "industry", label: "Сфера деятельности" },
    { key: "region", label: "Область" },
    { key: "city", label: "Город" },
    { key: "manager", label: "Ответственный" },
    {
      key: "priority",
      label: "Важность",
      render: (val) => val ? (
        <span className="px-2 py-1 text-xs rounded bg-yellow-200 text-yellow-800">{val}</span>
      ) : "-",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setNewCompany(defaultCompany); setSelectedRegionId(null); setShowModal(true); }}>
          Добавить компанию
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
        onClose={() => { setShowModal(false); setNewCompany(defaultCompany); }}
        title={newCompany.id ? "Редактировать компанию" : "Добавить компанию"}
      >
        <div className="flex flex-col gap-2 text-sm">
          <input className="border p-2 rounded" placeholder="Название компании" value={newCompany.name} onChange={(e) => setNewCompany((prev) => ({ ...prev, name: e.target.value }))} />
          <input className="border p-2 rounded" placeholder="ИНН" value={newCompany.inn} onChange={(e) => setNewCompany((prev) => ({ ...prev, inn: e.target.value }))} />

          {/* Сфера деятельности */}
          <select className="border p-2 rounded" value={newCompany.industry_id || ""} onChange={(e) => setNewCompany((prev) => ({ ...prev, industry_id: parseInt(e.target.value) || null }))}>
            <option value="">-- Выберите сферу деятельности --</option>
            {industries.map((ind) => (
              <option key={ind.id} value={ind.id}>{ind.value}</option>
            ))}
          </select>

          {/* Область */}
          <select className="border p-2 rounded" value={newCompany.region_id || ""} onChange={(e) => {
            const regionId = parseInt(e.target.value) || null;
            setSelectedRegionId(regionId);
            setNewCompany((prev) => ({ ...prev, region_id: regionId, city_id: null }));
          }}>
            <option value="">-- Выберите область --</option>
            {regions.map((reg) => (
              <option key={reg.id} value={reg.id}>{reg.name}</option>
            ))}
          </select>

          {/* Город */}
          <select className="border p-2 rounded" value={newCompany.city_id || ""} onChange={(e) => setNewCompany((prev) => ({ ...prev, city_id: parseInt(e.target.value) || null }))} disabled={!selectedRegionId}>
            <option value="">-- Выберите город --</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          {/* Важность */}
          <select className="border p-2 rounded" value={newCompany.priority || ""} onChange={(e) => setNewCompany((prev) => ({ ...prev, priority: e.target.value }))}>
            <option value="">-- Выберите важность --</option>
            {priorities.map((pr) => (
              <option key={pr.id} value={pr.value}>{pr.value}</option>
            ))}
          </select>

          {/* Ответственный */}
          <select className="border p-2 rounded" value={newCompany.responsible_id || ""} onChange={(e) => setNewCompany((prev) => ({ ...prev, responsible_id: parseInt(e.target.value) || null }))}>
            <option value="">-- Выберите ответственного --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>

          <Button onClick={handleSaveCompany} disabled={loading} className="bg-green-600 text-white hover:bg-green-700">
            {loading ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyPage;