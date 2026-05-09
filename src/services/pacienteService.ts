// src/services/pacienteService.ts
import { Pool } from 'pg';
import { Paciente } from '../entities/Paciente';

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'vidaplus',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: +(process.env.POSTGRES_PORT || 5432),
});

// Cria a tabela se não existir
export async function initPacienteTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      cpf VARCHAR(11) NOT NULL,
      email VARCHAR(100) NOT NULL,
      data_criacao TIMESTAMP NOT NULL
    )
  `);
}

export async function cadastrarPaciente(paciente: Omit<Paciente, 'id'>): Promise<Paciente> {
  // Validação simples de CPF (11 dígitos)
  if (!/^\d{11}$/.test(paciente.cpf)) {
    throw new Error('CPF inválido. Deve conter 11 dígitos.');
  }
  const dataCriacao = new Date();
  const result = await pool.query(
    'INSERT INTO pacientes (nome, cpf, email, data_criacao) VALUES ($1, $2, $3, $4) RETURNING *',
    [paciente.nome, paciente.cpf, paciente.email, dataCriacao]
  );
  // Auditoria: data de criação salva
  return new Paciente(
    result.rows[0].id,
    result.rows[0].nome,
    result.rows[0].cpf,
    result.rows[0].email,
    result.rows[0].data_criacao
  );
}

export async function listarPacientes(): Promise<Paciente[]> {
  const result = await pool.query('SELECT * FROM pacientes');
  return result.rows.map(row => new Paciente(row.id, row.nome, row.cpf, row.email, row.data_criacao));
}
