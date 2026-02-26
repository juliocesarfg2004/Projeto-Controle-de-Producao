import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-controle-de-producao-pwld.vercel.app",
});

export default api;