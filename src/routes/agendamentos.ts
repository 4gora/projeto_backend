/**
* @swagger
* {
*   "/agendamentos": {
*     "post": {
*       "summary": "Agendar uma nova consulta",
*       "tags": ["Agendamentos"],
*       "requestBody": {
*         "required": true,
*         "content": {
*           "application/json": {
*             "schema": {
*               "type": "object",
*               "properties": {
*                 "pacienteId": { "type": "integer" },
*                 "medicoId": { "type": "integer" },
*                 "data": { "type": "string", "format": "date-time", "example": "2026-05-10T14:00:00Z" }
*               },
*               "required": ["pacienteId", "medicoId", "data"]
*             }
*           }
*         }
*       },
*       "responses": {
*         "201": { "description": "Consulta agendada com sucesso" },
*         "400": { "description": "Erro de validação ou data retroativa" },
*         "409": { "description": "Conflito: Consulta já existe para este horário" }
*       }
*     }
*   },
*   "/agendamentos/": {
*     "get": {
*       "summary": "Listar todas as consultas",
*       "tags": ["Agendamentos"],
*       "responses": {
*         "200": { "description": "Lista de todas as consultas" }
*       }
*     }
*   },
*   "/agendamentos/paciente/{pacienteId}": {
*     "get": {
*       "summary": "Listar consultas de um paciente",
*       "tags": ["Agendamentos"],
*       "parameters": [
*         { "name": "pacienteId", "in": "path", "required": true, "schema": { "type": "integer" } }
*       ],
*       "responses": {
*         "200": { "description": "Lista de consultas do paciente" },
*         "404": { "description": "Paciente não encontrado" }
*       }
*     }
*   },
*   "/agendamentos/{id}": {
*     "put": {
*       "summary": "Remarcar data da consulta",
*       "tags": ["Agendamentos"],
*       "parameters": [
*         { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
*       ],
*       "requestBody": {
*         "required": true,
*         "content": {
*           "application/json": {
*             "schema": {
*               "type": "object",
*               "properties": {
*                 "novaData": { "type": "string", "format": "date-time", "example": "2026-05-11T10:00:00Z" }
*               },
*               "required": ["novaData"]
*             }
*           }
*         }
*       },
*       "responses": {
*         "200": { "description": "Consulta remarcada com sucesso" },
*         "400": { "description": "Erro de validação ou data retroativa" },
*         "404": { "description": "Consulta não encontrada" }
*       }
*     },
*     "delete": {
*       "summary": "Cancelar uma consulta",
*       "tags": ["Agendamentos"],
*       "parameters": [
*         { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
*       ],
*       "responses": {
*         "204": { "description": "Consulta cancelada com sucesso" },
*         "404": { "description": "Consulta não encontrada" }
*       }
*     }
*   }
* }
*/

// src/routes/agendamentos.ts

import { Router } from 'express';
import { 
  agendarConsulta, 
  listarConsultasPorPaciente, 
  cancelarConsulta, 
  remarcarConsulta, 
  listarTodasConsultas
} from '../services/agendamentoService';
import { handleRouteError } from '../utils/errorHandler';

const router = Router();


// POST /agendamentos - Criar nova consulta
router.post("/", async (req, res) => {
  try {
    const novaConsulta = await agendarConsulta(req.body);
    return res.status(201).json(novaConsulta);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// GET /agendamentos - listar todas as consultas
router.get("/", async (req, res) => {
  try {
    const consultas = await listarTodasConsultas();
    return res.json(consultas);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// GET /agendamentos/paciente/:pacienteId - Listar por paciente
router.get("/paciente/:pacienteId", async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const consultas = await listarConsultasPorPaciente(Number(pacienteId));
    if (!consultas || consultas.length === 0) {
      return res.json({ message: "Nenhuma consulta encontrada para este paciente.", consultas: [] });
    }
    return res.json(consultas);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// PUT /agendamentos/:id - Remarcar data da consulta
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { novaData } = req.body;
    
    const consultaAtualizada = await remarcarConsulta(Number(id), novaData);
    
    if (!consultaAtualizada) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }

    return res.json(consultaAtualizada);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// DELETE /agendamentos/:id - Cancelar consulta
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await cancelarConsulta(Number(id));
    
    if (!sucesso) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }

    return res.status(204).send();
  } catch (error) {
    return handleRouteError(res, error);
  }
});

export default router;