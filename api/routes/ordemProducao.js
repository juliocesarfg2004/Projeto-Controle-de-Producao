import prisma from "../prisma.js";
import express from "express";

const router = express.Router();

router.post("/ordem-producao", async (req, res) => {
  try {
    const { produto_id, data, quantidade, atualizado_por } = req.body;

    const produtoExiste = await prisma.produto.findUnique({
      where: { produto_id: Number(produto_id) },
    });

    if (!produtoExiste) {
      return res.status(400).json({ message: "Produto não encontrado." });
    }

    const ordem = await prisma.ordemProducao.create({
      data: {
        produto_id,
        data: new Date(data),
        quantidade,
        progresso: 0,
        atualizado_em: new Date(),
        atualizado_por,
      },
    });

    res.status(201).json({
      message: "Ordem de produção criada com sucesso.",
      data: ordem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar ordem de produção." });
  }
});

router.get("/ordem-producao", async (req, res) => {
  try {
    const ordens = await prisma.ordemProducao.findMany({
      include: {
        produto: true,
      },
      orderBy: { ordem_producao_id: "desc" },
    });

    res.status(200).json(ordens);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar ordens de produção." });
  }
});

router.put("/ordem-producao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { produto_id, data, quantidade, progresso, atualizado_por } = req.body;

    const camposParaAtualizar = {
      atualizado_em: new Date(),
    };

    if (produto_id !== undefined) camposParaAtualizar.produto_id = produto_id;
    if (data !== undefined) camposParaAtualizar.data = new Date(data);
    if (quantidade !== undefined) camposParaAtualizar.quantidade = quantidade;
    if (progresso !== undefined) camposParaAtualizar.progresso = progresso;
    if (atualizado_por !== undefined) camposParaAtualizar.atualizado_por = atualizado_por;

    const ordemAtualizada = await prisma.ordemProducao.update({
      where: { ordem_producao_id: Number(id) },
      data: camposParaAtualizar,
    });

    res.status(200).json({
      message: "Ordem de produção atualizada com sucesso.",
      data: ordemAtualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar ordem de produção." });
  }
});


router.delete("/ordem-producao/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const ordem = await prisma.ordemProducao.delete({
      where: { ordem_producao_id: Number(id) },
    });

    res.status(202).json({
      message: "Ordem de produção excluída com sucesso.",
      data: ordem,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar ordem de produção." });
  }
});

export default router;
