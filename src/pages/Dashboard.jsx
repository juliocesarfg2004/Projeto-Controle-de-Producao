import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [dateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totais, setTotais] = useState({
    usuarios: 0,
    produtos: 0,
    tipos: 0,
    ordens: 0
  });
  const [ultimasOrdens, setUltimasOrdens] = useState([]);
  const [ultimosProdutos, setUltimosProdutos] = useState([]);

  useEffect(() => {
    // Recuperar dados do usuário logado
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    carregarDados();

    return () => clearInterval(timer);
  }, []);

  async function carregarDados() {
    try {
      const [usuariosRes, produtosRes, tiposRes, ordensRes] = await Promise.all([
        api.get("/usuarios"),
        api.get("/produtos"),
        api.get("/tipos-produtos"),
        api.get("/ordem-producao")
      ]);

      setTotais({
        usuarios: usuariosRes.data.items?.length || 0,
        produtos: produtosRes.data.length || 0,
        tipos: tiposRes.data.length || 0,
        ordens: ordensRes.data.length || 0
      });

      setUltimasOrdens(ordensRes.data.slice(-3).reverse());
      setUltimosProdutos(produtosRes.data.slice(-3).reverse());
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pegar primeiro nome
  const getFirstName = (fullName) => {
    if (!fullName) return "Usuário";
    return fullName.split(' ')[0];
  };

  const cards = [
    { 
      title: "Usuários", 
      value: totais.usuarios, 
      icon: "👥", 
      color: "from-[#2563EB] to-[#1E3A5F]",
      link: "/usuarios"
    },
    { 
      title: "Produtos", 
      value: totais.produtos, 
      icon: "📦", 
      color: "from-[#059669] to-[#065F46]",
      link: "/produtos"
    },
    { 
      title: "Tipos", 
      value: totais.tipos, 
      icon: "🏷️", 
      color: "from-[#7C3AED] to-[#5B21B6]",
      link: "/tipos-produtos"
    },
    { 
      title: "Ordens", 
      value: totais.ordens, 
      icon: "📋", 
      color: "from-[#EA580C] to-[#9A3412]",
      link: "/ordem-producao"
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-74 p-8 bg-[#0F2744] min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="mt-2">
            <p className="text-[#94A3B8] capitalize">{formatDate(dateTime)}</p>
            <p className="text-2xl font-semibold text-[#60A5FA]">{formatTime(dateTime)}</p>
            
            {/* Mensagem de boas-vindas abaixo do horário */}
            <p className="text-lg text-white mt-3">
              Bem-vindo, <span className="font-bold text-[#60A5FA]">{user ? getFirstName(user.nome) : 'Usuário'}</span>! 👋
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-[#0A1929] rounded-lg shadow-xl p-6 border border-[#1E3A5F] animate-pulse">
                <div className="h-16 bg-[#1E3A5F] rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className={`bg-gradient-to-br ${card.color} rounded-lg shadow-xl p-6 text-white transform hover:scale-105 transition-all cursor-pointer`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                  </div>
                  <span className="text-4xl">{card.icon}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0A1929] rounded-lg shadow-xl p-6 border border-[#1E3A5F]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Últimas Ordens</h2>
              <Link to="/ordem-producao" className="text-[#60A5FA] hover:text-[#93C5FD] text-sm">
                Ver todas
              </Link>
            </div>
            
            {loading ? (
              <p className="text-[#94A3B8]">Carregando...</p>
            ) : ultimasOrdens.length === 0 ? (
              <p className="text-[#94A3B8] text-center py-4">Nenhuma ordem encontrada</p>
            ) : (
              <div className="space-y-3">
                {ultimasOrdens.map((ordem) => (
                  <div key={ordem.ordem_producao_id} className="flex justify-between items-center p-3 bg-[#0F2744] rounded-lg">
                    <div>
                      <p className="text-white font-medium">{ordem.produto?.descricao || "Produto"}</p>
                      <p className="text-xs text-[#94A3B8]">
                        {new Date(ordem.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className="text-[#FBBF24] font-semibold">{ordem.quantidade} unid.</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0A1929] rounded-lg shadow-xl p-6 border border-[#1E3A5F]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Últimos Produtos</h2>
              <Link to="/produtos" className="text-[#60A5FA] hover:text-[#93C5FD] text-sm">
                Ver todos
              </Link>
            </div>
            
            {loading ? (
              <p className="text-[#94A3B8]">Carregando...</p>
            ) : ultimosProdutos.length === 0 ? (
              <p className="text-[#94A3B8] text-center py-4">Nenhum produto encontrado</p>
            ) : (
              <div className="space-y-3">
                {ultimosProdutos.map((produto) => (
                  <div key={produto.produto_id} className="flex justify-between items-center p-3 bg-[#0F2744] rounded-lg">
                    <div>
                      <p className="text-white font-medium">{produto.descricao}</p>
                      <p className="text-xs text-[#94A3B8]">
                        {produto.tipo?.descricao || "Sem tipo"} • Estoque: {produto.estoque || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}