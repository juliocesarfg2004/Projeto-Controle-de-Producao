import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

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
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white border border-gray-300 rounded-md shadow-md">
      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block mb-4"
      >
        Voltar ao Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Produtos
      </h1>

      <div className="flex justify-between mb-6">
        <input
          placeholder="Buscar por nome ou tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-2/3"
        />

        <button
          onClick={novoProduto}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Novo Produto
        </button>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">Descrição</th>
              <th className="p-3 text-left border-b">Tipo</th>
              <th className="p-3 text-left border-b">Estoque</th>
              <th className="p-3 text-left border-b">Atualizado em</th>
              <th className="p-3 text-right border-b">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              filtrados.map((p) => (
                <tr key={p.produto_id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{p.descricao}</td>
                  <td className="p-3 border-b">{p.tipo?.descricao || "—"}</td>
                  <td className="p-3 border-b">
                    {p.estoque == null ? "—" : p.estoque}
                  </td>
                  <td className="p-3 border-b">
                    {p.atualizado_em
                      ? new Date(p.atualizado_em).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>

                  <td className="p-3 border-b text-right">
                    <button
                      onClick={() => editarProduto(p)}
                      className="text-yellow-600 hover:underline mr-3"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirProduto(p.produto_id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              {editing ? "Editar Produto" : "Novo Produto"}
            </h2>

            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Descrição</label>
                <input
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Tipo de Produto</label>
                <select
                  value={form.produto_tipo_id}
                  onChange={(e) =>
                    setForm({ ...form, produto_tipo_id: e.target.value })
                  }
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Selecione...</option>
                  {tipos.map((t) => (
                    <option key={t.material_tipo_id} value={t.material_tipo_id}>
                      {t.descricao}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Se o tipo não aparecer, cadastre-o em Tipos de Produtos.
                </p>
              </div>

              <div>
                <label className="block mb-1 font-medium">Estoque</label>
                <input
                  type="number"
                  min="0"
                  value={form.estoque}
                  onChange={(e) =>
                    setForm({ ...form, estoque: e.target.value })
                  }
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Atualizado por (ID do usuário)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.atualizado_por}
                  onChange={(e) =>
                    setForm({ ...form, atualizado_por: e.target.value })
                  }
                  className="w-full border rounded-md p-2"
                  placeholder="ID do usuário (ex: 1) — deixe vazio para null"
                />
              </div>

              <div className="flex justify-end gap-2">
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
                  {editing ? "Salvar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
