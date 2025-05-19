import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "minha_chave_secreta";

// Controller para registrar usuário
export const registerUser = async (req, res) => {
    try {
        const { name, email, age, senha } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        console.log("Email já cadastrado:", email);
        if (existingUser) return res.status(400).json({ message: "Email já cadastrado." });

        const hashedPassword = await bcrypt.hash(senha, 10);
        const user = await prisma.user.create({ data: { name, email, age, senha: hashedPassword } });
        console.log("Usuário criado:", user);
        res.status(201).json({ message: "Usuário criado com sucesso", user });
    } catch (err) {
        console.error("Erro ao registrar usuário:", err);
        res.status(500).json({ message: "Erro interno", details: err.message });
    }
};

// Controller para login
export const loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await prisma.user.findUnique({ where: { email } });
        if (!usuario) return res.status(400).json({ message: "Usuário não encontrado" });

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return res.status(401).json({ message: "Senha incorreta" });

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Erro interno", details: err.message });
    }
};

