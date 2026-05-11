import { Medico } from "../entities/Medico";
import { pool } from "../database";

export async function cadastrarMedico(
  medico: Omit<Medico, "id">,
): Promise<Medico> {
  // validação do CRM
  if (medico.crm.length !== 10) {
    throw new Error("O CRM deve ter exatamente 10 números.");
  }
  if (medico.nome.length === 0) {
    throw new Error("O nome do médico é obrigatório.");
  }
  if (medico.email.length === 0) {
    throw new Error("O email do médico é obrigatório.");
  }

  const dataCriacao = new Date();

  const result = await pool.query(
    "INSERT INTO medicos (nome, crm, email, data_criacao) VALUES ($1, $2, $3, $4) RETURNING *",
    [medico.nome, medico.crm, medico.email, dataCriacao],
  );

  const row = result.rows[0];

  return new Medico(row.id, row.nome, row.crm, row.email, row.data_criacao);
}
// Atualizar um medico
export async function atualizarMedico(
  id: number,
  dados: { nome?: string; crm?: string; email?: string },
) {
  const { nome, crm, email } = dados;

  if (crm && crm.length !== 10) {
    throw new Error("O CRM deve ter exatamente 10 números.");
  }
  if (nome && nome.length === 0) {
    throw new Error("O nome do médico é obrigatório.");
  }
  if (email && email.length === 0) {
    throw new Error("O email do médico é obrigatório.");
  }
  
  const result = await pool.query(
    `UPDATE medicos 
     SET nome = COALESCE($1, nome), 
         crm = COALESCE($2, crm), 
         email = COALESCE($3, email) 
     WHERE id = $4 
     RETURNING *`,
    [nome, crm, email, id],
  );

  return result.rows[0];
}

// Excluir um médico
export async function excluirMedico(id: number) {
  const result = await pool.query(
    "DELETE FROM medicos WHERE id = $1 RETURNING *",
    [id],
  );
  const retorno = result.rowCount || 0;
  return retorno > 0; // Retorna true se algo foi deletado
}

export async function listarMedicos(): Promise<Medico[]> {
  const result = await pool.query("SELECT * FROM medicos ORDER BY nome ASC");

  return result.rows.map(
    (row) => new Medico(row.id, row.nome, row.crm, row.email, row.data_criacao),
  );
}
