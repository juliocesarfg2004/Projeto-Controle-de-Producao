import prisma from "../prisma.js";
import express from "express";

const router = express.Router();

router.post("/tipos-produtos", async (req, res) => {
  try {
    const { descricao } = req.body;

    const tipo = await prisma.produtoTipo.create({
      data: { descricao },
    });

    res.status(201).json(tipo);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tipo de produto." });
  }
});

router.get("/tipos-produtos", async (req, res) => {
  try {
    const tipos = await prisma.produtoTipo.findMany({
      include: {
        produtos: true,
      },
    });

    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar tipos de produto." });
  }
});

router.put("/tipos-produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao } = req.body;

    const tipoAtualizado = await prisma.produtoTipo.update({
      where: { material_tipo_id: Number(id) },
      data: { descricao },
    });

    res.status(200).json(tipoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar tipo de produto." });
  }
});

router.delete("/tipos-produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const tipo = await prisma.produtoTipo.delete({
      where: { material_tipo_id: Number(id) },
    });

    res.status(202).json(tipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar tipo de produto." });
  }
});

export default router;
