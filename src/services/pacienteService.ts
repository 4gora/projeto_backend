import { Paciente } from "../entities/Paciente";
import { pool } from "../database";

// Cadastrar um paciente
export async function cadastrarPaciente(
  paciente: Omit<Paciente, "id">,
): Promise<Paciente> {
  // validação das informações
  if (paciente.cpf.length !== 11) {
    throw new Error("O CPF deve ter exatamente 11 números.");
  }
  if (paciente.nome.length === 0) {
    throw new Error("O nome do paciente é obrigatório.");
  }
  if (paciente.email.length === 0) {
    throw new Error("O email do paciente é obrigatório.");
  }
  // Validação da data de nascimento
  if (!paciente.dataNascimento) {
    throw new Error("A data de nascimento do paciente é obrigatória.");
  }
  const dataNasc = new Date(paciente.dataNascimento);
  if (isNaN(dataNasc.getTime())) {
    throw new Error("A data de nascimento é inválida.");
  }
  const hoje = new Date();
  if (dataNasc > hoje) {
    throw new Error("A data de nascimento não pode ser no futuro.");
  }
  const idade = hoje.getFullYear() - dataNasc.getFullYear();
  if (idade > 140) {
    throw new Error("A idade do paciente não pode ser maior que 140 anos.");
  }

  const dataCriacao = new Date();

  const result = await pool.query(
    "INSERT INTO pacientes (nome, cpf, data_nascimento, email, data_criacao) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [paciente.nome, paciente.cpf, dataNasc, paciente.email, dataCriacao],
  );

  const row = result.rows[0];

  return new Paciente(row.id, row.nome, row.cpf, row.data_nascimento, row.email, row.data_criacao);
}

// Atualizar um paciente
export async function atualizarPaciente(
  id: number,
  dados: { nome?: string; cpf?: string; email?: string, dataNascimento?: Date },
) {
  const { nome, cpf, email, dataNascimento } = dados;

  if (cpf && cpf.length !== 11) {
    throw new Error("O CPF deve ter exatamente 11 números.");
  }
  if (nome && nome.length === 0) {
    throw new Error("O nome do paciente é obrigatório.");
  }
  if (email && email.length === 0) {
    throw new Error("O email do paciente é obrigatório.");
  }
  if (dataNascimento) {
    const dataNasc = new Date(dataNascimento);
    if (isNaN(dataNasc.getTime())) {
      throw new Error("A data de nascimento é inválida.");
    }
    const hoje = new Date();
    if (dataNasc > hoje) {
      throw new Error("A data de nascimento não pode ser no futuro.");
    }
    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    if (idade > 140) {
      throw new Error("A idade do paciente não pode ser maior que 140 anos.");
    }
  }

  const result = await pool.query(
    `UPDATE pacientes 
     SET nome = COALESCE($1, nome), 
         cpf = COALESCE($2, cpf), 
         data_nascimento = COALESCE($3, data_nascimento), 
         email = COALESCE($4, email) 
     WHERE id = $5 
     RETURNING *`,
    [nome, cpf, dataNascimento, email, id],
  );

  return result.rows[0]; 
}
  // Excluir um paciente
  export async function excluirPaciente(id: number) {
    const result = await pool.query(
      "DELETE FROM pacientes WHERE id = $1 RETURNING *",
      [id],
    );
    const retorno = result.rowCount || 0;
    return retorno > 0; // Retorna true se algo foi deletado
  }

  export async function listarPacientes(): Promise<Paciente[]> {
    const result = await pool.query(
      "SELECT * FROM pacientes ORDER BY nome ASC",
    );

    return result.rows.map(
      (row) =>
        new Paciente(row.id, row.nome, row.cpf, row.data_nascimento, row.email, row.data_criacao),
    );
  }

