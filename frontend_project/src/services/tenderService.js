import api from "@/utils/api";

export const getTenders = async () => {
  try {
    const response = await api.get("/tenders");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении тендеров:", error);
    throw error;
  }
};

export const createTender = async (data) => {
  try {
    const response = await api.post("/tenders", data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании тендера:", error);
    throw error;
  }
};

export const updateTender = async (id, data) => {
  try {
    const response = await api.put(`/tenders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении тендера с id ${id}:`, error);
    throw error;
  }
};

export const deleteTender = async (id) => {
  try {
    await api.delete(`/tenders/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении тендера с id ${id}:`, error);
    throw error;
  }
};