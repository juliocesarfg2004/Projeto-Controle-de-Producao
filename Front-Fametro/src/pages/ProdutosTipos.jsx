import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

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
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white border border-gray-300 rounded-md shadow-md">
      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4 inline-block"
      >
        Voltar ao Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Tipos de Produtos
      </h1>

      <div className="flex justify-between mb-6">
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-2/3"
        />

        <button
          onClick={abrirNovo}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Novo Tipo
        </button>
      </div>
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">Descrição</th>
              <th className="p-3 text-left border-b">Qtd. Produtos</th>
              <th className="p-3 text-right border-b">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  Nenhum tipo encontrado
                </td>
              </tr>
            ) : (
              filtrados.map((t) => (
                <tr key={t.material_tipo_id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{t.descricao}</td>

                  <td className="p-3 border-b">{t.produtos?.length ?? 0}</td>

                  <td className="p-3 border-b text-right">
                    <button
                      onClick={() => abrirEdicao(t)}
                      className="text-yellow-600 hover:underline mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluir(t.material_tipo_id)}
                      className="text-red-600 hover:underline"
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              {editing ? "Editar Tipo" : "Novo Tipo"}
            </h2>

            <form onSubmit={salvar} className="space-y-4">
              <input
                className="w-full border rounded-md p-2"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editing ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}