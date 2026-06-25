import { BrowserRouter, Routes, Route } from "react-router-dom"
import ListaUsuarios from "./pages/ListaUsuarios"
import Cadastro from "./pages/Cadastro"
import Login from "./pages/Login"
import OrdemProducao from "./pages/OrdemProducao"
import Produtos from "./pages/Produtos"
import TiposProdutos from "./pages/ProdutosTipos"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/usuarios" element={
          <PrivateRoute>
            <ListaUsuarios />
          </PrivateRoute>
        } />
        <Route path="/tipos-produtos" element={
          <PrivateRoute>
            <TiposProdutos />
          </PrivateRoute>
        } />
        <Route path="/produtos" element={
          <PrivateRoute>
            <Produtos />
          </PrivateRoute>
        } />
        <Route path="/ordem-producao" element={
          <PrivateRoute>
            <OrdemProducao />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
