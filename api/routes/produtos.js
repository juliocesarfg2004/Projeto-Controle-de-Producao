import prisma from "../prisma.js";
import express from "express";

const router = express.Router();

router.post("/produtos", async (req, res) => {
  try {
    const { descricao, produto_tipo_id, estoque, atualizado_por } = req.body;

    const produto = await prisma.produto.create({
      data: {
        descricao,
        produto_tipo_id,
        estoque,
        atualizado_em: new Date(),
        atualizado_por,
      },
    });

    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto." });
  }
});

router.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        tipo: true,
      },
    });

    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar produtos." });
  }
});

router.put("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, produto_tipo_id, estoque, atualizado_por } = req.body;

    const produtoAtualizado = await prisma.produto.update({
      where: { produto_id: Number(id) },
      data: {
        descricao,
        produto_tipo_id,
        estoque,
        atualizado_em: new Date(),
        atualizado_por,
      },
    });

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar produto." });
  }
});

router.delete("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.delete({
      where: { produto_id: Number(id) },
    });

    res.status(202).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar produto." });
  }
});

export default router;
