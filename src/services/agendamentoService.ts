// src/services/agendamentoService.ts

import { pool } from '../database';
import { Consulta } from '../entities/Consulta';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function agendarConsulta(consulta: Omit<Consulta, 'id'>): Promise<Consulta> {
  // Verificaca se a data da consulta é no passado
  const hoje = new Date();
  if (new Date(consulta.data) < hoje) {
    throw new Error('Não é possível agendar uma consulta para uma data passada.');
  }

  const result = await pool.query(
    `INSERT INTO consultas (paciente_id, medico_id, data) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [
      consulta.pacienteId, 
      consulta.medicoId, 
      consulta.data
    ]
  );

  const row = result.rows[0];

  return new Consulta(
    row.id,
    row.pacienteId,
    row.medicoId,
    row.data
  );
}

export async function listarTodasConsultas(): Promise<any[]> {
  const result = await pool.query(`
    SELECT 
      c.id, 
      c.data, 
      c.paciente_id AS "pacienteId", 
      p.nome AS "nomePaciente",
      c.medico_id AS "medicoId", 
      m.nome AS "nomeMedico"
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN medicos m ON c.medico_id = m.id
    ORDER BY c.data ASC
  `);

  return result.rows;
}


export async function listarConsultasPorPaciente(pacienteId: number): Promise<any[]> {
  const result = await pool.query(`
    SELECT 
      c.id, 
      c.data, 
      c.paciente_id AS "pacienteId", 
      p.nome AS "nomePaciente",
      c.medico_id AS "medicoId", 
      m.nome AS "nomeMedico"
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN medicos m ON c.medico_id = m.id
    WHERE c.paciente_id = $1
    ORDER BY c.data ASC
  `, [pacienteId]);

  return result.rows;
}

export async function cancelarConsulta(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM consultas WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    throw new NotFoundError('Consulta não encontrada');
  }
  return true;
}

export async function remarcarConsulta(id: number, novaData: Date): Promise<Consulta> {
  // Verificaca se a nova data da consulta é no passado
  const hoje = new Date();
  if (novaData < hoje) {
    throw new Error('Não é possível remarcar para uma data passada.');
  }

  const result = await pool.query(
    'UPDATE consultas SET data = $1 WHERE id = $2 RETURNING *',
    [novaData, id]
  );

  const row = result.rows[0];

  if (!row) {
    throw new NotFoundError('Consulta não encontrada');
  }

  return new Consulta(
    row.id,
    row.pacienteId,
    row.medicoId,
    row.data
  );
}