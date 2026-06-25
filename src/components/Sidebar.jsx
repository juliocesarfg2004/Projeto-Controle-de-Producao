import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Tags, 
  ClipboardList,
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/usuarios", icon: <Users size={20} />, label: "Usuários" },
    { path: "/tipos-produtos", icon: <Tags size={20} />, label: "Tipos" },
    { path: "/produtos", icon: <Package size={20} />, label: "Produtos" },
    { path: "/ordem-producao", icon: <ClipboardList size={20} />, label: "Ordens" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-74 bg-[#0A1929] border-r border-[#1E3A5F] h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-[#1E3A5F]">
        <h1 className="text-2xl font-bold text-[#60A5FA]">FAMETRO</h1>
        <p className="text-sm text-[#94A3B8] mt-1">Sistema de Produção</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-[#1E3A5F] text-white"
                    : "text-[#94A3B8] hover:bg-[#132F4C] hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#1E3A5F]">
        <button
          onClick={() => {
            localStorage.removeItem("usuario");
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-[#F87171] hover:bg-[#1E3A5F] hover:text-[#FCA5A5] rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}