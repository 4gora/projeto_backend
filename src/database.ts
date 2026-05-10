import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT) || 5432,
})

// teste de conexão
pool.on('connect', () => {
    console.log('Conectado ao banco de dados Postgres');
});

pool.on('error', (err) => {
    console.error('Erro na conexão com o banco de dados Postgres:', err);
});