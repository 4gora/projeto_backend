import request from "supertest";
import app from "../index";
import { describe, it, expect } from "@jest/globals";

describe("Testes: Agendamentos", () => {
  // 1. Teste de agendamento de datas incorretas
  it("Deve retornar erro ao tentar agendar uma consulta com data retroativa", async () => {
    const dataPassada = "2020-01-01T10:00:00Z";
    const response = await request(app).post("/agendamentos").send({
      pacienteId: 1,
      medicoId: 1,
      data: dataPassada,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain("data passada");
  });

  // 2. Teste de JOIN: se nomes dos pacientes e médicos estão sendo retornados corretamente
  it("Deve retornar consultas com nomes de pacientes e médicos", async () => {
    // Primeiro, agendamos uma consulta válida
    const dataFutura = "2027-01-01T10:00:00Z";
    await request(app).post("/agendamentos").send({
      pacienteId: 1,
      medicoId: 1,
      data: dataFutura,
    });

    const response = await request(app).get("/agendamentos");

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("nomePaciente");
    expect(response.body[0]).toHaveProperty("nomeMedico");
  });

  // 3. Teste de retorno 404 para paciente inexistente
  it("Deve retornar 404 ao listar consultas de um paciente inexistente", async () => {
    const response = await request(app).get("/agendamentos/paciente/9999");
    expect(response.status).toBe(404);
  });

  // 4. Teste de conflito de agenda
  it("Deve impedir dois agendamentos para o mesmo médico no mesmo horário", async () => {
    const horarioOcupado = "2026-12-25T15:00:00Z";

    // Agenda a primeira vez (Sucesso esperado)
    await request(app).post("/agendamentos").send({
      pacienteId: 1,
      medicoId: 1,
      data: horarioOcupado,
    });

    // Tenta agendar para outro paciente no mesmo horário (Erro esperado)
    const response = await request(app).post("/agendamentos").send({
      pacienteId: 2, // Maria Oliveira (Mock)
      medicoId: 1, // Mesmo Dr. Alessandro
      data: horarioOcupado,
    });

    // O status deve ser 409 (Conflito) ou 400 (Bad Request)
    expect(response.status).toBe(409);
    expect(response.body.error).toContain("horário já está ocupado");
  });
});
