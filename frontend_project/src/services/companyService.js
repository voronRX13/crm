import api from "@/utils/api";

// Получить список компаний
export const getCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

// Создать новую компанию
export const createCompany = async (data) => {
  const response = await api.post("/companies", data);
  return response.data;
};

// Обновить существующую компанию
export const updateCompany = async (id, data) => {
  const response = await api.put(`/companies/${id}`, data);
  return response.data;
};

// Удалить компанию
export const deleteCompany = async (id) => {
  const response = await api.delete(`/companies/${id}`);
  return response.data;
};