import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/usuarios", {
        nome,
        login,
        senha,
      });
      alert("Usuário Cadastrado com Sucesso!");
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message || "Erro desconhecido";
      alert("Erro: " + msg);
      console.error("Erro no cadastro:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1929] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] to-[#0A1929] opacity-50"></div>
      
      <div className="bg-[#0F2744] rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-[#1E3A5F]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
          <p className="text-[#94A3B8] mt-2">Preencha os dados para se cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              Nome completo
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              type="text"
              required
              className="w-full px-4 py-3 bg-[#0A1929] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              Email
            </label>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              type="email"
              required
              className="w-full px-4 py-3 bg-[#0A1929] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              Senha
            </label>
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type="password"
              required
              className="w-full px-4 py-3 bg-[#0A1929] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-lg hover:bg-[#1D4ED8] transition duration-200 font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-center mt-6 text-[#94A3B8]">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-[#60A5FA] hover:text-[#93C5FD] font-medium hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;