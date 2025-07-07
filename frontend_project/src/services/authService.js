// src/services/authService.js
import api from "../utils/api";

export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);
  const { access_token } = response.data;
  localStorage.setItem("access_token", access_token);
}