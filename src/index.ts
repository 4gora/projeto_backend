import { pool } from "./database";
import express from "express";
import * as dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import pacienteRoutes from './routes/pacientes';
import medicoRoutes from './routes/medicos';
import agendamentoRoutes from './routes/agendamentos';

dotenv.config();

const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SGHSS VidaPlus API",
      version: "1.0.0",
      description: "Sistema de Gestão Hospitalar",
    },
  },
apis: ["**/*.ts"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send(
    '<h1>Servidor VidaPlus Online</h1><p>Acesse <a href="/api-docs">/api-docs</a> para a documentação.</p>',
  );
});

// FUNÇÃO DE CONEXÃO COM RETRY
const connectWithRetry = async (retries = 5) => {
  while (retries) {
    try {
      const client = await pool.connect();

      // TABELAS
      // pacientes
      await client.query(`
        CREATE TABLE IF NOT EXISTS pacientes (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          cpf VARCHAR(11) UNIQUE NOT NULL,
          data_nascimento DATE,
          email VARCHAR(100),
          historico_clinico TEXT,
          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
       // medicos
      await client.query(`
        CREATE TABLE IF NOT EXISTS medicos (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          crm VARCHAR(10) UNIQUE NOT NULL,
          email VARCHAR(100),
          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // consultas
      await client.query(`
        CREATE TABLE IF NOT EXISTS consultas (
          id SERIAL PRIMARY KEY,
          paciente_id INTEGER NOT NULL,
          medico_id INTEGER NOT NULL,
          data TIMESTAMP NOT NULL,
          CONSTRAINT fk_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
        );
      `);
     

      console.log("Banco de Dados: Tabelas verificadas/prontas.");
      client.release();
      break;
    } catch (err) {
      retries -= 1;
      console.error(
        `Erro ao conectar ao banco. Tentativas restantes: ${retries}`,
      );
      if (retries === 0) {
        console.error("FALHA CRÍTICA: Não foi possível conectar ao banco.");
      } else {
        await new Promise((res) => setTimeout(res, 5000));
      }
    }
  }
};

app.use('/pacientes', pacienteRoutes);
app.use('/agendamentos', agendamentoRoutes);
app.use('/medicos', medicoRoutes);

// INICIAR O SERVIDOR INDEPENDENTE DO BANCO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);

  // Inicia a tentativa de conexão com o banco em segundo plano
  connectWithRetry();
});

export default app;
