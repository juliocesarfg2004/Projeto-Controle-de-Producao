import express from "express";
import cors from "cors"
import usersRouter from "./routes/usuarios.js";
import produtosRouter from "./routes/produtos.js";
import produtosTiposRouter from "./routes/produtosTipos.js";
import ordemProducaoRouter from "./routes/ordemProducao.js";

const app = express();

app.use(express.json());

app.use(cors())

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

export default app;