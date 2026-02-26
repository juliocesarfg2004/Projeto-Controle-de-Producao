import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-controle-de-producao.vercel.app",
});

export default api;