// src/services/medicoService.ts

import { Medico } from '../entities/Medico';
import { pool } from '../database';

export async function cadastrarMedico(medico: Omit<Medico, 'id'>): Promise<Medico> {
  
  // validação do CRM
  if (medico.crm.length !== 10) {
    throw new Error('O CRM deve ter exatamente 10 números.');
  }

  const dataCriacao = new Date();

  const result = await pool.query(
    'INSERT INTO medicos (nome, crm, email, data_criacao) VALUES ($1, $2, $3, $4) RETURNING *',
    [medico.nome, medico.crm, medico.email, dataCriacao]
  );

  const row = result.rows[0];

  return new Medico(
    row.id,
    row.nome,
    row.crm,
    row.email,
    row.data_criacao
  );
}

export async function listarMedicos(): Promise<Medico[]> {
  const result = await pool.query('SELECT * FROM medicos ORDER BY nome ASC');
  
  return result.rows.map(row => new Medico(
    row.id, 
    row.nome, 
    row.crm, 
    row.email, 
    row.data_criacao
  ));
}