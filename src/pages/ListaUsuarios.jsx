import api from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function ListaUsuarios() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'edit' ou 'create'
  const [editUser, setEditUser] = useState({
    usuario_id: null,
    nome: "",
    login: "",
    senha: "",
  });
  
  // Estado para novo usuário
  const [newUser, setNewUser] = useState({
    nome: "",
    login: "",
    senha: "",
  });

  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isAdmin = usuarioLogado?.user?.tipo === "admin";

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

  // Função para abrir modal de edição
  function openEditModal(user) {
    setModalType('edit');
    setEditUser({
      usuario_id: user.usuario_id,
      nome: user.nome,
      login: user.login,
      senha: "",
    });
    setShowModal(true);
  }

  // Função para abrir modal de criação
  function openCreateModal() {
    setModalType('create');
    setNewUser({
      nome: "",
      login: "",
      senha: "",
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalType('');
    setEditUser({ usuario_id: null, nome: "", login: "", senha: "" });
    setNewUser({ nome: "", login: "", senha: "" });
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

  // Função para criar novo usuário
  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      const response = await api.post("/usuarios", newUser);
      // Recarrega a lista de usuários
      const usersResponse = await api.get("/usuarios");
      setAllUsers(usersResponse.data.items);
      alert("Usuário cadastrado com sucesso!");
      closeModal();
    } catch (error) {
      alert("Erro ao cadastrar usuário");
      console.error(error);
    }
  }

  if (loading) return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-[#0F2744] min-h-screen flex items-center justify-center">
        <p className="text-[#94A3B8]">Carregando usuários...</p>
      </main>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      
      <main className="flex-1 p-8 bg-[#0F2744] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Lista de Usuários</h2>
            <button
              onClick={openCreateModal}
              className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] flex items-center gap-2 transition-colors"
            >
              <span>+</span> Novo Usuário
            </button>
          </div>

          <div className="bg-[#0A1929] rounded-lg shadow-xl border border-[#1E3A5F] overflow-hidden">
              <table className="min-w-full divide-y divide-[#1E3A5F]">
                <thead className="bg-[#0F2744]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Nome</th>
                    {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Email</th>}
                    {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Tipo</th>}
                    {isAdmin && <th className="px-13 py-3 text-right text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]">
                  {allUsers.map((user) => (
                    <tr key={user.usuario_id} className="hover:bg-[#132F4C] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">{user.usuario_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">{user.nome}</td>
                      {isAdmin && <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">{user.login || "-"}</td>}
                      {isAdmin && <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">{user.tipo}</td>}
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-[#FBBF24] hover:text-[#FCD34D] mr-3 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUsers(user.usuario_id)}
                            className="text-[#F87171] hover:text-[#FCA5A5] transition-colors"
                          >
                            Excluir
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>

        {/* Modal de Edição/Criação */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-[#0A1929] p-6 rounded-lg shadow-xl w-full max-w-md border border-[#1E3A5F]">
              <h3 className="text-xl font-bold mb-4 text-center text-white">
                {modalType === 'edit' ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              
              <form onSubmit={modalType === 'edit' ? handleSaveEdit : handleCreateUser} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o nome"
                    value={modalType === 'edit' ? editUser.nome : newUser.nome}
                    onChange={(e) => {
                      if (modalType === 'edit') {
                        setEditUser({ ...editUser, nome: e.target.value });
                      } else {
                        setNewUser({ ...newUser, nome: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-md text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Digite o email"
                    value={modalType === 'edit' ? editUser.login : newUser.login}
                    onChange={(e) => {
                      if (modalType === 'edit') {
                        setEditUser({ ...editUser, login: e.target.value });
                      } else {
                        setNewUser({ ...newUser, login: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-md text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    {modalType === 'edit' ? 'Nova senha (opcional)' : 'Senha'}
                  </label>
                  <input
                    type="password"
                    placeholder={modalType === 'edit' ? 'Deixe em branco para manter' : 'Digite a senha'}
                    value={modalType === 'edit' ? editUser.senha : newUser.senha}
                    onChange={(e) => {
                      if (modalType === 'edit') {
                        setEditUser({ ...editUser, senha: e.target.value });
                      } else {
                        setNewUser({ ...newUser, senha: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-2 bg-[#0F2744] border border-[#1E3A5F] rounded-md text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
                    required={modalType === 'create'}
                  />
                  {modalType === 'edit' && (
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Preencha apenas se quiser alterar a senha
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-[#1E3A5F] rounded-md text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors"
                  >
                    {modalType === 'edit' ? 'Salvar Alterações' : 'Criar Usuário'}
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