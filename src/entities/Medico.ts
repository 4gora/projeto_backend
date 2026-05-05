// src/entities/Medico.ts
export class Medico {
  id: number;
  nome: string;
  crm: string;
  email: string;
  dataCriacao: Date;

  constructor(id: number, nome: string, crm: string, email: string, dataCriacao: Date) {
    this.id = id;
    this.nome = nome;
    this.crm = crm;
    this.email = email;
    this.dataCriacao = dataCriacao;
  }
}
