// src/entities/Paciente.ts
export class Paciente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  dataCriacao: Date;

  constructor(id: number, nome: string, cpf: string, email: string, dataCriacao: Date) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.dataCriacao = dataCriacao;
  }
}
