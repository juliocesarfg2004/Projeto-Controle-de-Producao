import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import api from "../services/api";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post("/login", {
        login: emailRef.current.value,
        senha: passwordRef.current.value,
      });

      if (response.status === 200) {
        alert("Login realizado com sucesso!");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Senha ou Email Incorretos!");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Login
      </h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Senha"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400">
          Entrar
        </button>
      </form>
      <Link
        to="/"
        className="text-blue-700 hover:underline mt-4 block text-center cursor-pointer"
      >
        Não tem uma conta? Cadastra-se
      </Link>
    </div>
  );
}

export default Login;
