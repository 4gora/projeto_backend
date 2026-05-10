// src/entities/Paciente.ts
export class Paciente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  dataCriacao?: Date; // data "opcional" para nao ter problema em pacientes.ts

  constructor(id: number, nome: string, cpf: string, email: string, dataCriacao?: Date) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.dataCriacao = dataCriacao;
  }
}
