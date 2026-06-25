import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    descricao: "",
    produto_tipo_id: "",
    estoque: 0,
    atualizado_por: "",
  });

  useEffect(() => {
    carregarProdutos();
    carregarTipos();
  }, []);

  async function carregarProdutos() {
    try {
      const { data } = await api.get("/produtos");
      setProdutos(data);
    } catch (err) {
      console.error("GET /produtos error:", err.response?.data || err);
      alert("Erro ao carregar produtos.");
    }
  }

  async function carregarTipos() {
    try {
      const { data } = await api.get("/tipos-produtos");
      setTipos(data);
    } catch (err) {
      console.warn("GET /tipos-produtos falhou:", err.response?.data || err);
    }
  }

  function novoProduto() {
    setEditing(null);
    setForm({
      descricao: "",
      produto_tipo_id: "",
      estoque: 0,
      atualizado_por: "",
    });
    setShowModal(true);
  }

  function editarProduto(produto) {
    setEditing(produto);
    setForm({
      descricao: produto.descricao ?? "",
      produto_tipo_id: produto.produto_tipo_id ?? "",
      estoque: produto.estoque ?? 0,
      atualizado_por:
        produto.atualizado_por == null ? "" : String(produto.atualizado_por),
    });
    setShowModal(true);
  }

  async function excluirProduto(id) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    } catch (err) {
      console.error("DELETE /produtos/:id", err.response?.data || err);
      alert("Erro ao excluir produto.");
    }
  }

  async function salvar(e) {
    e.preventDefault();
    const payload = {
      descricao: form.descricao,
      produto_tipo_id:
        form.produto_tipo_id === "" || form.produto_tipo_id == null
          ? null
          : Number(form.produto_tipo_id),
      estoque:
        form.estoque === "" || form.estoque == null
          ? null
          : Number(form.estoque),
      atualizado_por:
        form.atualizado_por === "" || form.atualizado_por == null
          ? null
          : Number(form.atualizado_por),
    };
    if (!payload.produto_tipo_id) {
      alert("Selecione um tipo de produto válido.");
      return;
    }

    try {
      if (editing) {
        await api.put(`/produtos/${editing.produto_id}`, payload);
      } else {
        await api.post("/produtos", payload);
      }

      setShowModal(false);
      carregarProdutos();
    } catch (err) {
      console.error("Erro ao salvar produto:", err.response?.data || err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.meta?.cause;
      alert(serverMsg || "Erro ao salvar produto.");
    }
  }

  const filtrados = produtos.filter((p) => {
    const texto = search.trim().toLowerCase();
    if (!texto) return true;
    const campos = [
      p.descricao?.toLowerCase() ?? "",
      p.tipo?.descricao?.toLowerCase() ?? "",
    ];
    return campos.some((c) => c.includes(texto));
  });

  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 bg-[#0F2744] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Produtos</h1>
            <button
              onClick={novoProduto}
              className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] flex items-center gap-2 transition-colors"
            >
              <span>+</span> Novo Produto
            </button>
          </div>

          <div className="bg-[#0A1929] rounded-lg shadow-xl border border-[#1E3A5F] mb-6">
            <div className="p-4 border-b border-[#1E3A5F]">
              <input
                type="text"
                placeholder="Buscar por nome ou tipo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-96 px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#1E3A5F]">
                <thead className="bg-[#0F2744]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      Atualizado em
                    </th>
                    <th className="px-13 py-3 text-right text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]">
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-[#94A3B8]">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((p) => (
                      <tr key={p.produto_id} className="hover:bg-[#132F4C] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">
                          {p.descricao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">
                          {p.tipo?.descricao || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">
                          {p.estoque == null ? "—" : p.estoque}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">
                          {p.atualizado_em
                            ? new Date(p.atualizado_em).toLocaleDateString("pt-BR")
                            : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => editarProduto(p)}
                            className="text-[#FBBF24] hover:text-[#FCD34D] mr-3 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => excluirProduto(p.produto_id)}
                            className="text-[#F87171] hover:text-[#FCA5A5] transition-colors"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#0A1929] rounded-lg p-6 w-full max-w-md border border-[#1E3A5F]">
              <h2 className="text-xl font-bold mb-4 text-white">
                {editing ? "Editar Produto" : "Novo Produto"}
              </h2>

              <form onSubmit={salvar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Tipo de Produto
                  </label>
                  <select
                    value={form.produto_tipo_id}
                    onChange={(e) => setForm({ ...form, produto_tipo_id: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  >
                    <option value="" className="bg-[#0A1929]">Selecione...</option>
                    {tipos.map((t) => (
                      <option key={t.material_tipo_id} value={t.material_tipo_id} className="bg-[#0A1929]">
                        {t.descricao}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Estoque
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.estoque}
                    onChange={(e) => setForm({ ...form, estoque: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Atualizado por (ID do usuário)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.atualizado_por}
                    onChange={(e) => setForm({ ...form, atualizado_por: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    placeholder="ID do usuário"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-[#1E3A5F] rounded-lg text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
                  >
                    {editing ? "Salvar" : "Criar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}