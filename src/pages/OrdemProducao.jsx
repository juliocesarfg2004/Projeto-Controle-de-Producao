import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

export default function OrdemProducao() {
  const [ordens, setOrdens] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    produto_id: "",
    data: "",
    quantidade: "",
    atualizado_por: "",
  });

  useEffect(() => {
    carregarOrdens();
    carregarProdutos();
    carregarUsuarios();
  }, []);

  async function carregarOrdens() {
    try {
      const response = await api.get("/ordem-producao");
      setOrdens(response.data);
    } catch (error) {
      alert("Erro ao carregar ordens de produção");
    } finally {
      setLoading(false);
    }
  }

  async function carregarProdutos() {
    try {
      const response = await api.get("/produtos");
      setProdutos(response.data);
    } catch (error) {
      alert("Erro ao carregar produtos");
    }
  }

  async function carregarUsuarios() {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data.items);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar usuários");
    }
  }

  async function criarOrdem(e) {
    e.preventDefault();

    try {
      await api.post("/ordem-producao", {
        ...form,
        produto_id: Number(form.produto_id),
        quantidade: Number(form.quantidade),
        atualizado_por: Number(form.atualizado_por),
      });

      alert("Ordem criada com sucesso!");
      setForm({
        produto_id: "",
        data: "",
        quantidade: "",
        atualizado_por: "",
      });
      setShowForm(false);
      carregarOrdens();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar ordem de produção");
    }
  }

  async function atualizarProgresso(id, progresso) {
    try {
      await api.put(`/ordem-producao/${id}`, {
        progresso: Number(progresso),
      });

      setOrdens((prev) =>
        prev.map((ordem) =>
          ordem.ordem_producao_id === id
            ? { ...ordem, progresso: Number(progresso) }
            : ordem
        )
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar progresso");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir esta ordem?")) return;

    try {
      await api.delete(`/ordem-producao/${id}`);
      setOrdens((prev) => prev.filter((ordem) => ordem.ordem_producao_id !== id));
      alert("Ordem excluída com sucesso!");
    } catch (error) {
      alert("Erro ao excluir ordem de produção");
    }
  }

  function getProgressColor(progresso) {
    if (progresso < 30) return "bg-[#EF4444]";
    if (progresso < 70) return "bg-[#F59E0B]";
    return "bg-[#10B981]";
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 bg-[#0F2744] min-h-screen flex items-center justify-center">
          <p className="text-[#94A3B8]">Carregando ordens...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 bg-[#0F2744] min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Ordens de Produção</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] flex items-center gap-2 transition-colors"
            >
              <span>{showForm ? "−" : "+"}</span>
              {showForm ? "Fechar" : "Nova Ordem"}
            </button>
          </div>

          {/* Formulário de nova ordem */}
          {showForm && (
            <div className="bg-[#0A1929] rounded-lg shadow-xl border border-[#1E3A5F] mb-6 p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Nova Ordem de Produção</h2>
              <form onSubmit={criarOrdem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Produto
                  </label>
                  <select
                    value={form.produto_id}
                    onChange={(e) => setForm({ ...form, produto_id: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  >
                    <option value="" className="bg-[#0A1929]">Selecione um produto</option>
                    {produtos.map((p) => (
                      <option key={p.produto_id} value={p.produto_id} className="bg-[#0A1929]">
                        {p.descricao}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantidade"
                    value={form.quantidade}
                    onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Responsável
                  </label>
                  <select
                    value={form.atualizado_por}
                    onChange={(e) => setForm({ ...form, atualizado_por: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  >
                    <option value="" className="bg-[#0A1929]">Selecione o responsável</option>
                    {usuarios.map((u) => (
                      <option key={u.usuario_id} value={u.usuario_id} className="bg-[#0A1929]">
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-[#1E3A5F] rounded-lg text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
                  >
                    Criar Ordem
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de ordens */}
          <div className="bg-[#0A1929] rounded-lg shadow-xl border border-[#1E3A5F]">
            <div className="p-4 border-b border-[#1E3A5F]">
              <h2 className="text-lg font-semibold text-white">Ordens Registradas</h2>
            </div>

            {ordens.length === 0 ? (
              <div className="p-8 text-center text-[#94A3B8]">
                Nenhuma ordem registrada.
              </div>
            ) : (
              <div className="divide-y divide-[#1E3A5F]">
                {ordens.map((ordem) => (
                  <div key={ordem.ordem_producao_id} className="p-6 hover:bg-[#132F4C] transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {ordem.produto?.descricao || "Produto não identificado"}
                        </h3>
                        <p className="text-sm text-[#94A3B8] mt-1">
                          ID: {ordem.ordem_producao_id}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(ordem.ordem_producao_id)}
                        className="text-[#F87171] hover:text-[#FCA5A5] text-sm font-medium transition-colors"
                      >
                        Excluir
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-[#94A3B8]">Quantidade</p>
                        <p className="text-lg font-semibold text-white">{ordem.quantidade}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#94A3B8]">Data</p>
                        <p className="text-lg font-semibold text-white">
                          {new Date(ordem.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#94A3B8]">Progresso</p>
                        <p className="text-lg font-semibold text-white">{ordem.progresso ?? 0}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#94A3B8]">Progresso</span>
                        <span className="font-medium text-white">{ordem.progresso ?? 0}%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-[#1E3A5F] rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${getProgressColor(ordem.progresso ?? 0)}`}
                            style={{ width: `${ordem.progresso ?? 0}%` }}
                          ></div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={ordem.progresso ?? 0}
                          onChange={(e) => atualizarProgresso(ordem.ordem_producao_id, e.target.value)}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-[#64748B] text-center mt-1">
                        Arraste para atualizar o progresso
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}