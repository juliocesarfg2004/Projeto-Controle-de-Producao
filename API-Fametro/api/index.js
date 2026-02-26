import express from "express";
import cors from "cors"
import usersRouter from "./routes/usuarios.js";
import produtosRouter from "./routes/produtos.js";
import produtosTiposRouter from "./routes/produtosTipos.js";
import ordemProducaoRouter from "./routes/ordemProducao.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: ["https://projeto-controle-de-producao-7kcm.vercel.app", "http://localhost:5173"],
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


app.listen(3000, () => console.log(`Servidor rodando na porta http://localhost:${3000}`))

export default app;

import serverless from "serverless-http";
export const handler = serverless(app);
