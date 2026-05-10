// src/services/pacienteService.ts

import { Paciente } from '../entities/Paciente';
import { pool } from '../database';

export async function cadastrarPaciente(paciente: Omit<Paciente, 'id'>): Promise<Paciente> {
  
  // validação do CPF
  if (paciente.cpf.length !== 11) {
    throw new Error('O CPF deve ter exatamente 11 números.');
  }

  const dataCriacao = new Date();

  const result = await pool.query(
    'INSERT INTO pacientes (nome, cpf, email, data_criacao) VALUES ($1, $2, $3, $4) RETURNING *',
    [paciente.nome, paciente.cpf, paciente.email, dataCriacao]
  );

  const row = result.rows[0];

  return new Paciente(
    row.id,
    row.nome,
    row.cpf,
    row.email,
    row.data_criacao
  );
}

export async function listarPacientes(): Promise<Paciente[]> {
  const result = await pool.query('SELECT * FROM pacientes ORDER BY nome ASC');
  
  return result.rows.map(row => new Paciente(
    row.id, 
    row.nome, 
    row.cpf, 
    row.email, 
    row.data_criacao
  ));
}