import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

export default function TiposProdutos() {
  const [tipos, setTipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    carregarTipos();
  }, []);

  async function carregarTipos() {
    try {
      const { data } = await api.get("/tipos-produtos");
      setTipos(data);
    } catch (err) {
      alert("Erro ao carregar tipos de produtos.");
    }
  }

  function abrirNovo() {
    setDescricao("");
    setEditing(null);
    setShowModal(true);
  }

  function abrirEdicao(tipo) {
    setEditing(tipo);
    setDescricao(tipo.descricao);
    setShowModal(true);
  }

  async function excluir(id) {
    if (!window.confirm("Deseja realmente excluir?")) return;

    try {
      await api.delete(`/tipos-produtos/${id}`);
      carregarTipos();
    } catch {
      alert("Erro ao excluir.");
    }
  }

  async function salvar(e) {
    e.preventDefault();

    try {
      if (editing) {
        await api.put(`/tipos-produtos/${editing.material_tipo_id}`, {
          descricao,
        });
      } else {
        await api.post("/tipos-produtos", { descricao });
      }

      setShowModal(false);
      carregarTipos();
    } catch {
      alert("Erro ao salvar tipo.");
    }
  }

  const filtrados = tipos.filter((t) =>
    t.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 p-8 bg-[#0F2744] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Tipos de Produtos</h1>
            <button
              onClick={abrirNovo}
              className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] flex items-center gap-2 transition-colors"
            >
              <span>+</span> Novo Tipo
            </button>
          </div>

          <div className="bg-[#0A1929] rounded-lg shadow-xl border border-[#1E3A5F] mb-6">
            <div className="p-4 border-b border-[#1E3A5F]">
              <input
                type="text"
                placeholder="Buscar por descrição..."
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
                      Qtd. Produtos
                    </th>
                    <th className="px-13 py-3 text-right text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]">
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-[#94A3B8]">
                        Nenhum tipo encontrado
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((t) => (
                      <tr key={t.material_tipo_id} className="hover:bg-[#132F4C] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">
                          {t.descricao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">
                          {t.produtos?.length ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => abrirEdicao(t)}
                            className="text-[#FBBF24] hover:text-[#FCD34D] mr-3 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => excluir(t.material_tipo_id)}
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
                {editing ? "Editar Tipo" : "Novo Tipo"}
              </h2>

              <form onSubmit={salvar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                    autoFocus
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
                    {editing ? "Atualizar" : "Criar"}
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