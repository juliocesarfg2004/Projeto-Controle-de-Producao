import prisma from "../prisma.js";
import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/usuarios", async (req, res) => {
  try {
    const { nome, login, senha } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(senha, salt);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        login,
        senha: hashPassword,
        atualizado_em: new Date(),
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário." });
  }
});

router.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.status(200).json({
      message: "Usuários encontrados com sucesso.",
      items: usuarios,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
});

router.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, login, senha, atualizado_por } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(senha, salt);

    const usuarioAtualizado = await prisma.usuario.update({
      where: { usuario_id: Number(id) },
      data: {
        nome,
        login,
        senha: hashPassword,
        atualizado_em: new Date(),
        atualizado_por,
      },
    });

    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
});

router.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioDeletado = await prisma.usuario.delete({
      where: { usuario_id: Number(id) },
    });

    res.status(202).json(usuarioDeletado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { login, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { login },
    });

    if (!usuario) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    res.status(200).json({ message: "Login realizado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});


export default router;
