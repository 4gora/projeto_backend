// src/entities/Consulta.ts
export class Consulta {
  id: number;
  pacienteId: number;
  medicoId: number;
  data: Date;

  constructor(id: number, pacienteId: number, medicoId: number, data: Date) {
    this.id = id;
    this.pacienteId = pacienteId;
    this.medicoId = medicoId;
    this.data = data;
  }
}
