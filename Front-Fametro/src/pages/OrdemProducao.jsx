import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function OrdemProducao() {
  const [ordens, setOrdens] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setOrdens((prev) =>
        prev.filter((ordem) => ordem.ordem_producao_id !== id)
      );

      alert("Ordem excluída com sucesso!");
    } catch (error) {
      alert("Erro ao excluir ordem de produção");
    }
  }

  if (loading)
    return <p className="text-center mt-10">Carregando ordens...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white border border-gray-300 rounded-md shadow-md">
      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-3"
      >
        Voltar ao Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Ordem de Produção
      </h1>
      <form
        onSubmit={criarOrdem}
        className="flex flex-col gap-3 bg-gray-100 p-4 rounded-md"
      >
        <select
          value={form.produto_id}
          onChange={(e) =>
            setForm({ ...form, produto_id: e.target.value })
          }
          className="p-2 rounded border"
          required
        >
          <option value="">Selecione um produto</option>
          {produtos.map((p) => (
            <option key={p.produto_id} value={p.produto_id}>
              {p.descricao}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
          className="p-2 rounded border"
          required
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={(e) =>
            setForm({ ...form, quantidade: e.target.value })
          }
          className="p-2 rounded border"
          required
        />
        <select
          value={form.atualizado_por}
          onChange={(e) =>
            setForm({ ...form, atualizado_por: e.target.value })
          }
          className="p-2 rounded border"
          required
        >
          <option value="">Selecione o responsável</option>
          {usuarios.map((u) => (
            <option key={u.usuario_id} value={u.usuario_id}>
              {u.nome}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Criar Ordem
        </button>
      </form>
      <h2 className="text-2xl mt-8 mb-3 text-center font-semibold">
        Ordens Registradas
      </h2>

      {ordens.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhuma ordem registrada.
        </p>
      ) : (
        <ul className="space-y-4">
          {ordens.map((ordem) => (
            <li
              key={ordem.ordem_producao_id}
              className="border p-4 rounded-md bg-gray-50 shadow-sm"
            >
              <p>
                <strong>Produto:</strong>{" "}
                {ordem.produto?.descricao || "—"}
              </p>

              <p>
                <strong>Quantidade:</strong> {ordem.quantidade}
              </p>

              <p>
                <strong>Data:</strong>{" "}
                {new Date(ordem.data).toLocaleDateString("pt-BR")}
              </p>

              <p>
                <strong>Progresso:</strong> {ordem.progresso ?? 0}%
              </p>

              <input
                type="range"
                min="0"
                max="100"
                value={ordem.progresso ?? 0}
                onChange={(e) =>
                  atualizarProgresso(
                    ordem.ordem_producao_id,
                    e.target.value
                  )
                }
                className="w-full mt-2"
              />

              <button
                onClick={() => handleDelete(ordem.ordem_producao_id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md mt-3 hover:bg-red-600"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}