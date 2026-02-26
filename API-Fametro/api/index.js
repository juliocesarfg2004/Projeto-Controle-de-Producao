import express from "express";
import cors from "cors";
import serverless from "serverless-http";

import usersRouter from "./routes/usuarios.js";
import produtosRouter from "./routes/produtos.js";
import produtosTiposRouter from "./routes/produtosTipos.js";
import ordemProducaoRouter from "./routes/ordemProducao.js";

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "https://projeto-controle-de-producao.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// Rotas
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