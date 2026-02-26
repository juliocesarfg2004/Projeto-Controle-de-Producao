import express from "express";
import cors from "cors"
import usersRouter from "./routes/usuarios.js";
import produtosRouter from "./routes/produtos.js";
import produtosTiposRouter from "./routes/produtosTipos.js";
import ordemProducaoRouter from "./routes/ordemProducao.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: ["https://projeto-controle-de-producao.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use("/", usersRouter);
app.use("/", produtosRouter);
app.use("/", produtosTiposRouter);
app.use("/", ordemProducaoRouter);

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "API está funcionando" });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

export default app;

import serverless from "serverless-http";
export const handler = serverless(app);
