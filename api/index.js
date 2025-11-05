import express from "express";
import cors from "cors";

import usersRouter from "../routes/usuarios.js";
import produtosRouter from "../routes/produtos.js";
import produtosTiposRouter from "../routes/produtosTipos.js";
import ordemProducaoRouter from "../routes/ordemProducao.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://controle-de-producao-front-a6hc04q4q.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use("/", usersRouter);
app.use("/", produtosRouter);
app.use("/", produtosTiposRouter);
app.use("/", ordemProducaoRouter);

export default app;
