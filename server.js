import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  authRoutes  from "./middlewares/routes/authRoutes.js";
import { despesasRoutes } from "./middlewares/routes/despesasRoutes.js";
import { loginUser } from "./controllers/authController.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas organizadas
app.use("/api/auth", authRoutes);
app.use("/api/despesas", despesasRoutes);
app.post("/login", loginUser); // <- corrigido aqui

// Inicialização do servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


// http://localhost:3000
//anderson
//DevSouza2026@
//DevSouza2026%40%0A

/*
Criar = ok
Listar = ok
Alterar = ok
Deletar = 


*/
