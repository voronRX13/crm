import React, { useState, useEffect } from "react";
import axios from "@/utils/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Pencil, Trash, PlusCircle, Upload } from "lucide-react";

const categories = [
  { key: "activity", label: "Сфера деятельности" },
  { key: "region", label: "Области и города" },
  { key: "importance", label: "Важность" },
  { key: "contract_status", label: "Статусы договоров" },
  { key: "act_status", label: "Статусы актов" },
  { key: "invoice_status", label: "Статусы счетов" },
  { key: "news_type", label: "Типы новостей" },
  { key: "news_status", label: "Статусы новостей" },
  { key: "procedure_status", label: "Статусы процедур" },
];

export default function ReferencesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [references, setReferences] = useState([]);
  const [regions, setRegions] = useState([]);
  const [city, setCity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("regions");
  const [selectedRegionId, setSelectedRegionId] = useState("");

  useEffect(() => {
    if (selectedCategory?.key === "region") {
      fetchRegions();
      fetchCity();
    }
  }, [selectedCategory]);

  const fetchReferences = async (category) => {
    try {
      const res = await axios.get(`/references/${category}`);
      setReferences(res.data);
    } catch (err) {
      console.error("Ошибка загрузки справочника:", err);
      alert("Не удалось загрузить данные");
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await axios.get("/regions");
      setRegions(res.data);
    } catch (err) {
      console.error("Ошибка загрузки областей:", err);
    }
  };

  const fetchCity = async () => {
    try {
      const res = await axios.get("/city");
      setCity(res.data);
    } catch (err) {
      console.error("Ошибка загрузки городов:", err);
    }
  };

  const handleOpenCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat.key !== "region") fetchReferences(cat.key);
  };

  const handleOpenModal = (value = "", id = null, regionId = "") => {
    setCurrentValue(value);
    setCurrentId(id);
    setSelectedRegionId(regionId || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (currentId) {
        await axios.put(`/references/${currentId}`, { value: currentValue });
      } else {
        await axios.post(`/references`, { category: selectedCategory.key, value: currentValue });
      }
      setShowModal(false);
      fetchReferences(selectedCategory.key);
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      alert("Не удалось сохранить значение");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот элемент?")) return;
    try {
      await axios.delete(`/references/${id}`);
      fetchReferences(selectedCategory.key);
    } catch (err) {
      console.error("Ошибка удаления:", err);
      alert("Не удалось удалить значение");
    }
  };

  const handleImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // ✅ теперь разрешены CSV и XLSX
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        await axios.post("/regions/import", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Импорт завершен успешно");
        fetchRegions();
        fetchCity();
      } catch (err) {
        console.error("Ошибка импорта:", err);
        alert("Ошибка при импорте данных");
      }
    };
    fileInput.click();
  };

  const handleSaveRegion = async () => {
    try {
      if (currentId) {
        await axios.put(`/regions/${currentId}`, { name: currentValue });
      } else {
        await axios.post("/regions", { name: currentValue });
      }
      setShowModal(false);
      fetchRegions();
    } catch (err) {
      console.error("Ошибка сохранения области:", err);
      alert("Не удалось сохранить область");
    }
  };

  const handleSaveCity = async () => {
    try {
      if (!selectedRegionId) return alert("Выберите область");
      if (currentId) {
        await axios.put(`/city/${currentId}`, { name: currentValue, region_id: selectedRegionId });
      } else {
        await axios.post("/city", { name: currentValue, region_id: selectedRegionId });
      }
      setShowModal(false);
      fetchCity();
    } catch (err) {
      console.error("Ошибка сохранения города:", err);
      alert("Не удалось сохранить город");
    }
  };

  const handleDeleteItem = async (item, type) => {
    if (!window.confirm("Удалить этот элемент?")) return;
    try {
      await axios.delete(`/${type}/${item.id}`);
      type === "regions" ? fetchRegions() : fetchCity();
    } catch (err) {
      console.error("Ошибка удаления:", err);
      alert("Не удалось удалить");
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Справочники</h2>

        <div className="flex gap-6">
          <aside className="w-64 border-r pr-6">
            <ul className="flex flex-col gap-2">
              {categories.map((cat) => (
                <li key={cat.key}>
                  <button
                    onClick={() => handleOpenCategory(cat)}
                    className={`w-full text-left text-base p-3 rounded-lg transition
                      ${selectedCategory?.key === cat.key ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-grow max-w-5xl mx-auto">
            {selectedCategory ? (
              selectedCategory.key !== "region" ? (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-4 gap-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Справочник: {selectedCategory.label}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal()}
                        className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        title="Добавить"
                      >
                        <PlusCircle size={18} />
                      </button>
                    </div>
                  </div>

                  <ul className="border rounded-2xl divide-y divide-gray-100">
                    {references.map((item) => (
                      <li key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition">
                        <span className="text-base text-gray-800">{item.value}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(item.value, item.id)}
                            className="p-2 rounded-full hover:bg-gray-200 transition text-gray-600"
                            title="Редактировать"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-full hover:bg-red-100 transition text-red-600"
                            title="Удалить"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedTab("regions")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedTab === "regions" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Области
                      </button>
                      <button
                        onClick={() => setSelectedTab("city")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedTab === "city" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Города
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal()}
                        className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        title="Добавить"
                      >
                        <PlusCircle size={18} />
                      </button>
                      <button
                        onClick={handleImport}
                        className="p-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition"
                        title="Импортировать"
                      >
                        <Upload size={18} />
                      </button>
                    </div>
                  </div>

                  <ul className="border rounded-2xl divide-y divide-gray-100">
                    {(selectedTab === "regions" ? regions : city).map((item) => (
                      <li key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition">
                        <span className="text-base text-gray-800">
                          {item.name}
                          {selectedTab === "city" && (
                            <span className="text-sm text-gray-500 ml-1">({item.region?.name || "Без области"})</span>
                          )}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(item.name, item.id, item.region_id)}
                            className="p-2 rounded-full hover:bg-gray-200 transition text-gray-600"
                            title="Редактировать"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item, selectedTab)}
                            className="p-2 rounded-full hover:bg-red-100 transition text-red-600"
                            title="Удалить"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ) : (
              <p className="text-base text-gray-500">Выберите категорию для просмотра и редактирования значений.</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentId ? "Редактировать значение" : "Добавить значение"}
      >
        <div className="flex flex-col gap-4 text-base">
          <input
            className="border p-3 rounded-lg text-base"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Введите значение"
          />
          {selectedCategory?.key === "region" && selectedTab === "city" && (
            <select
              className="border p-3 rounded-lg text-base"
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
            >
              <option value="">Выберите область</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
          <Button
            onClick={
              selectedCategory?.key === "region"
                ? selectedTab === "regions"
                  ? handleSaveRegion
                  : handleSaveCity
                : handleSave
            }
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Сохранить
          </Button>
        </div>
      </Modal>
    </div>
  );
}