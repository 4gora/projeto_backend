import express from 'express';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT) || 5432,
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SGHSS VidaPlus API',
      version: '1.0.0',
      description: 'Sistema de Gestão Hospitalar',
    },
  },
  apis: ['./src/index.ts'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.send('<h1>Servidor VidaPlus Online</h1><p>Acesse <a href="/api-docs">/api-docs</a> para a documentação.</p>');
});

// FUNÇÃO DE CONEXÃO COM RETRY
const connectWithRetry = async (retries = 5) => {
  while (retries) {
    try {
      const client = await pool.connect();
      await client.query(`
        CREATE TABLE IF NOT EXISTS pacientes (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          cpf VARCHAR(11) UNIQUE NOT NULL,
          data_nascimento DATE,
          email VARCHAR(100),
          historico_clinico TEXT
        );
      `);
      console.log("Conectado ao Postgres e tabelas prontas.");
      client.release();
      break; // Sucesso, sai do loop
    } catch (err) {
      retries -= 1;
      console.error(`Erro ao conectar. Tentativas restantes: ${retries}`);
      if (retries === 0) {
        console.error("Não foi possível conectar ao banco após várias tentativas.");
      } else {
        await new Promise(res => setTimeout(res, 5000)); // Espera 5s antes de tentar de novo
      }
    }
  }
};

// INICIAR O SERVIDOR INDEPENDENTE DO BANCO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
  
  // Inicia a tentativa de conexão com o banco em segundo plano
  connectWithRetry();
});