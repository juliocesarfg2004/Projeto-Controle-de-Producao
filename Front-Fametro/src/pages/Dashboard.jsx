import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-700 mb-10 text-center">
        Controle de Produção
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        <Link
          to="/usuarios"
          className="bg-white shadow-md border border-gray-200 p-6 rounded-xl text-center hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Usuários</h2>
          <p className="text-gray-500">Gerenciar cadastro de usuários</p>
        </Link>
        <Link
          to="/tipos-produtos"
          className="bg-white shadow-md border border-gray-200 p-6 rounded-xl text-center hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Tipos de Produtos
          </h2>
          <p className="text-gray-500">Categorias e classificações</p>
        </Link>
        <Link
          to="/produtos"
          className="bg-white shadow-md border border-gray-200 p-6 rounded-xl text-center hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Produtos</h2>
          <p className="text-gray-500">Gerenciar produtos cadastrados</p>
        </Link>

        <Link
          to="/ordem-producao"
          className="bg-white shadow-md border border-gray-200 p-6 rounded-xl text-center hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Ordem de Produção
          </h2>
          <p className="text-gray-500">Controle e acompanhamento</p>
        </Link>
      </div>
    </div>
  );
}
