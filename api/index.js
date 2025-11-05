import express from "express";
import cors from "cors";
import serverless from "serverless-http";

import usersRouter from "./routes/usuarios.js";
import produtosRouter from "./routes/produtos.js";
import produtosTiposRouter from "./routes/produtosTipos.js";
import ordemProducaoRouter from "./routes/ordemProducao.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://controle-de-producao-front-a6hc04q4q.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", usersRouter);
app.use("/", produtosRouter);
app.use("/", produtosTiposRouter);
app.use("/", ordemProducaoRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});


const handler = serverless(app);

export default handler;
export { handler };
