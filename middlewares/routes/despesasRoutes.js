import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../auth.js';

const prisma = new PrismaClient();


const router = express.Router();

// Criar Despesa
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { descricao, valor, categoria, data } = req.body;
    const novaDespesa = await prisma.despesa.create({
      data: {
        descricao,
        valor,
        categoria,
        data: new Date(data),
        userId: req.usuario.id,
      },
    });
    res.status(201).json(novaDespesa);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar despesa", details: err.message });
  }
});

// Listar Despesas por mês/ano
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.usuario.id;
    const mes = parseInt(req.query.mes);
    const ano = parseInt(req.query.ano);

    if (isNaN(mes) || isNaN(ano)) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    const despesas = await prisma.despesa.findMany({
      where: {
        userId,
        data: {
          gte: new Date(ano, mes - 1, 1),
          lt: new Date(ano, mes, 1),
        },
      },
      orderBy: { data: 'asc' },
    });

    res.status(200).json(despesas);
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar despesas", details: err.message });
  }
});

export { router as despesasRoutes };
