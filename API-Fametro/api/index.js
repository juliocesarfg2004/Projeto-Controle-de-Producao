import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import usersRouter from "./routes/usuarios.js";
import produtosRouter from "./routes/produtos.js";
import produtosTiposRouter from "./routes/produtosTipos.js";
import ordemProducaoRouter from "./routes/ordemProducao.js";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use("/", usersRouter);
app.use("/", produtosRouter);
app.use("/", produtosTiposRouter);
app.use("/", ordemProducaoRouter);

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "API está funcionando" });
});

app.listen(3000, () => console.log(`Servidor rodando na porta http://localhost:${3000}`))

export const handler = serverless(app);
