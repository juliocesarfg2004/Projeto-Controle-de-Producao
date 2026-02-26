import api from "../services/api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ListaUsuarios() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState({
    usuario_id: null,
    nome: "",
    login: "",
    senha: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get("/usuarios");
        setAllUsers(response.data.items);
      } catch (error) {
        alert("Erro ao carregar usuários");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  async function handleDeleteUsers(id) {
    try {
      await api.delete(`/usuarios/${id}`);
      setAllUsers((prev) => prev.filter((item) => item.usuario_id !== id));
      alert("Usuário excluído com sucesso!");
    } catch (error) {
      alert("Erro ao excluir usuário");
      console.error(error);
    }
  }

  function handleLogout() {
    alert("Você saiu do sistema");
    navigate("/login");
  }

  function openEditModal(user) {
    setEditUser({
      usuario_id: user.usuario_id,
      nome: user.nome,
      login: user.login,
      senha: "",
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditUser({ usuario_id: null, nome: "", login: "", senha: "" });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${editUser.usuario_id}`, editUser);
      setAllUsers((prev) =>
        prev.map((u) =>
          u.usuario_id === editUser.usuario_id
            ? { ...u, nome: editUser.nome, login: editUser.login }
            : u
        )
      );
      alert("Usuário atualizado com sucesso!");
      closeModal();
    } catch (error) {
      alert("Erro ao atualizar usuário");
      console.error(error);
    }
  }

  if (loading) return <p className="text-center mt-10">Carregando usuários...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white border border-gray-300 rounded-md shadow-md">
      <Link
  to="/dashboard"
  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-3"
>
  Voltar ao Dashboard
</Link>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Lista de Usuários
      </h2>
      <div className="flex justify-between">
        <Link
          to="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400"
        >
          Novo Cadastro
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
        >
          Logout
        </button>
      </div>

      <ul className="space-y-2 mt-5">
        {allUsers.map((user) => (
          <li key={user.usuario_id} className="bg-gray-100 p-3 rounded-md">
            <p className="font-semibold">Id: {user.usuario_id}</p>
            <p className="font-semibold">Nome: {user.nome}</p>
            <p className="font-semibold">Email: {user.login}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openEditModal(user)}
                className="bg-yellow-400 font-semibold p-1 text-center rounded-md cursor-pointer"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteUsers(user.usuario_id)}
                className="bg-red-400 font-semibold p-1 text-center rounded-md cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-center">
              Editar Usuário
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <input
                type="text"
                placeholder="Nome"
                value={editUser.nome}
                onChange={(e) =>
                  setEditUser({ ...editUser, nome: e.target.value })
                }
                className="border p-2 w-full rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Login"
                value={editUser.login}
                onChange={(e) =>
                  setEditUser({ ...editUser, login: e.target.value })
                }
                className="border p-2 w-full rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Nova senha (opcional)"
                value={editUser.senha}
                onChange={(e) =>
                  setEditUser({ ...editUser, senha: e.target.value })
                }
                className="border p-2 w-full rounded-md"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
