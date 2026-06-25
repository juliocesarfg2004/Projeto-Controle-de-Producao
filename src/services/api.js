import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://projeto-controle-de-producao1.vercel.app",
});

api.interceptors.request.use((config) => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token = usuario?.token || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;