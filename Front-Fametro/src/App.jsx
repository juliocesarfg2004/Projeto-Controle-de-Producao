import { BrowserRouter, Routes, Route } from "react-router-dom"
import ListaUsuarios from "./pages/ListaUsuarios"
import Cadastro from "./pages/Cadastro"
import Login from "./pages/Login"
import OrdemProducao from "./pages/OrdemProducao"
import Produtos from "./pages/Produtos"
import TiposProdutos from "./pages/ProdutosTipos"
import Dashboard from "./pages/Dashboard"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/usuarios" element={<ListaUsuarios />}/>
        <Route path="/produtos" element={<Produtos />}/>
        <Route path="/tipos-produtos" element={<TiposProdutos />}/>
        <Route path="/ordem-producao" element={<OrdemProducao />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
