// src/services/agendamentoService.ts
import { pool } from '../database';
import { Consulta } from '../entities/Consulta';

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

export async function listarConsultasPorPaciente(pacienteId: number): Promise<Consulta[]> {
  const result = await pool.query(
    'SELECT * FROM consultas WHERE paciente_id = $1 ORDER BY data_hora ASC',
    [pacienteId]
  );

  return result.rows.map(row => new Consulta(
    row.id,
    row.pacienteId,
    row.medicoId,
    row.data
  ));
}