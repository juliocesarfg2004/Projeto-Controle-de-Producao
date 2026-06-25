import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://projeto-controle-de-producao1.vercel.app",
});

export default api;