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
        // Verifica se a resposta tem os dados do usuário
        console.log("Dados do usuário:", response.data);
        
        // Salva os dados do usuário no localStorage
        // Ajuste conforme a estrutura da sua API
        localStorage.setItem("usuario", JSON.stringify(response.data));
        
        alert("Login realizado com sucesso!");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Senha ou Email Incorretos!");
      console.error("Erro no login:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1929] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] to-[#0A1929] opacity-50"></div>
      
      <div className="bg-[#0F2744] rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-[#1E3A5F]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Bem-vindo</h1>
          <p className="text-[#94A3B8] mt-2">Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              required
              className="w-full px-4 py-3 bg-[#0A1929] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              Senha
            </label>
            <input
              ref={passwordRef}
              type="password"
              required
              className="w-full px-4 py-3 bg-[#0A1929] border border-[#1E3A5F] rounded-lg text-white placeholder-[#64748B] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-lg hover:bg-[#1D4ED8] transition duration-200 font-medium text-lg shadow-lg"
          >
            Entrar
          </button>
        </form>

        <p className="text-center mt-6 text-[#94A3B8]">
          Não tem uma conta?{" "}
           <Link to="/cadastro" className="text-[#60A5FA] hover:text-[#93C5FD] font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;