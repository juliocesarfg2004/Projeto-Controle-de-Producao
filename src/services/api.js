import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-controle-de-producao1.vercel.app",
});

export default api;