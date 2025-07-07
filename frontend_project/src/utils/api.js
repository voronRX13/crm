// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Интерсептор для запроса — автоматически добавляет токен, если он есть
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Ошибка при чтении access_token из localStorage:", error);
    }
    return config;
  },
  (error) => {
    console.error("Ошибка при формировании запроса:", error);
    return Promise.reject(error);
  }
);

// Интерсептор для ответов — здесь можно централизованно обрабатывать ошибки
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `Ошибка API [${error.response.status}] ${error.response.config?.url}:`,
        error.response.data
      );
    } else if (error.request) {
      console.error("Сервер не ответил на запрос:", error.request);
    } else {
      console.error("Ошибка при настройке запроса:", error.message);
    }
    return Promise.reject(error);
  }
);
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log("Токен перед запросом:", token); // добавить
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;