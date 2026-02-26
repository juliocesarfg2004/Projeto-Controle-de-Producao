import express from "express";
import serverless from "serverless-http";
import usersRouter from "./routes/usuarios.js";
import produtosRouter from "./routes/produtos.js";
import produtosTiposRouter from "./routes/produtosTipos.js";
import ordemProducaoRouter from "./routes/ordemProducao.js";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://projeto-controle-de-producao.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use("/", usersRouter);
app.use("/", produtosRouter);
app.use("/", produtosTiposRouter);
app.use("/", ordemProducaoRouter);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API está funcionando" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

export default serverless(app);