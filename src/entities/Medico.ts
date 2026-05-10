// src/entities/Medico.ts
export class Medico {
  id: number;
  nome: string;
  crm: string;
  email: string;
  dataCriacao?: Date; // data "opcional" para nao ter problema em pacientes.ts

  constructor(id: number, nome: string, crm: string, email: string, dataCriacao?: Date) {
    this.id = id;
    this.nome = nome;
    this.crm = crm;
    this.email = email;
    this.dataCriacao = dataCriacao;
  }
}
