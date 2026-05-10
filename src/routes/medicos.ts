/**
 * @swagger
 * {
 * "/medicos": {
 * "get": {
 * "summary": "Listar todos os médicos",
 * "tags": ["Médicos"],
 * "responses": {
 * "200": { "description": "Sucesso" }
 * }
 * },
 * "post": {
 * "summary": "Cadastrar um novo médico",
 * "tags": ["Médicos"],
 * "requestBody": {
 * "required": true,
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "nome": { "type": "string" },
 * "crm": { "type": "string" },
 * "email": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": {
 * "201": { "description": "Médico cadastrado" },
 * "400": { "description": "Erro na validação" }
 * }
 * }
 * }
 * }
 */

// src/routes/medicos.ts
import { Router } from "express";
import { cadastrarMedico, listarMedicos } from "../services/medicoService";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { nome, crm, email } = req.body;
    const medico = await cadastrarMedico({ nome, crm, email });
    res.status(201).json(medico);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const medicos = await listarMedicos();
    res.json(medicos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;