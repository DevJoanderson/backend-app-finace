import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Controller para criar despesa
export const createDespesa = async (req, res) => {
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
};

// Controller para listar despesas
export const listarDespesas = async (req, res) => {
    try {
        const userId = req.usuario.id;
        const mes = parseInt(req.query.mes);
        const ano = parseInt(req.query.ano);

        if (isNaN(mes) || isNaN(ano)) {
            return res.status(400).json({ message: "Parâmetros inválidos." });
        }

        const primeiroDiaDoMes = new Date(ano, mes - 1, 1);
        const primeiroDiaProximoMes = new Date(ano, mes, 1);

        const despesas = await prisma.despesa.findMany({
            where: {
                userId: userId,
                data: {
                    gte: primeiroDiaDoMes,
                    lt: primeiroDiaProximoMes,
                },
            },
            orderBy: { data: "asc" },
        });

        res.status(200).json(despesas);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar despesas", details: err.message });
    }
};
