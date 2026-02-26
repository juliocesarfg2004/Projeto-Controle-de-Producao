import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post("/usuarios", {
        nome,
        login,
        senha,
      });
      alert("Usuário Cadastrado com Sucesso!");
      console.log(response.data);

      navigate('/login')
    } catch (error) {
      alert("Erro ao Cadastrar Usuário");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Cadastro
      </h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setNome(e.target.value)}
          type="text"
          placeholder="Nome"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          onChange={(e) => setLogin(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          onChange={(e) => setSenha(e.target.value)}
          type="password"
          placeholder="Senha"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400">
          Cadastrar
        </button>
      </form>
      <Link
        to="/login"
        className="text-blue-700 hover:underline mt-4 block text-center cursor-pointer"
      >
        Já tem uma conta? Faça Login
      </Link>
    </div>
  );
}

export default Cadastro;
