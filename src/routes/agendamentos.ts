/**
* @swagger
* {
*   "/agendamentos": {
*     "post": {
*       "summary": "Agendar uma nova consulta",
*       "description": "Cria uma nova consulta para um paciente e médico em um horário específico.",
*       "tags": ["Agendamentos"],
*       "requestBody": {
*         "required": true,
*         "content": {
*           "application/json": {
*             "schema": {
*               "type": "object",
*               "properties": {
*                 "pacienteId": { "type": "integer", "description": "ID do paciente" },
*                 "medicoId": { "type": "integer", "description": "ID do médico" },
*                 "data": { "type": "string", "format": "date-time", "description": "Data e hora da consulta", "example": "2026-05-10T14:00:00Z" }
*               },
*               "required": ["pacienteId", "medicoId", "data"]
*             }
*           }
*         }
*       },
*       "responses": {
*         "201": {
*           "description": "Consulta agendada com sucesso",
*           "content": {
*             "application/json": {
*               "example": { "id": 1, "pacienteId": 1, "medicoId": 2, "data": "2026-05-10T14:00:00Z" }
*             }
*           }
*         },
*         "400": {
*           "description": "Erro de validação ou data retroativa",
*           "content": { "application/json": { "example": { "error": "Não é possível agendar uma consulta para uma data passada." } } }
*         },
*         "409": {
*           "description": "Conflito: Consulta já existe para este horário",
*           "content": { "application/json": { "example": { "error": "Este horário já está ocupado para este médico." } } }
*         }
*       }
*     },
*     "get": {
*       "summary": "Listar todas as consultas",
*       "description": "Retorna todas as consultas agendadas, incluindo nomes de paciente e médico.",
*       "tags": ["Agendamentos"],
*       "responses": {
*         "200": {
*           "description": "Lista de todas as consultas",
*           "content": { "application/json": { "example": [ { "id": 1, "pacienteId": 1, "nomePaciente": "João", "medicoId": 2, "nomeMedico": "Dra. Ana", "data": "2026-05-10T14:00:00Z" } ] } }
*         }
*       }
*     }
*   },
*   "/agendamentos/paciente/{pacienteId}": {
*     "get": {
*       "summary": "Listar consultas de um paciente",
*       "description": "Retorna todas as consultas de um paciente pelo seu ID. Se não houver consultas, retorna uma mensagem informativa.",
*       "tags": ["Agendamentos"],
*       "parameters": [
*         { "name": "pacienteId", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "ID do paciente" }
*       ],
*       "responses": {
*         "200": {
*           "description": "Lista de consultas do paciente ou mensagem informativa",
*           "content": { "application/json": { "examples": {
*             "comConsultas": { "value": [ { "id": 1, "pacienteId": 1, "nomePaciente": "João", "medicoId": 2, "nomeMedico": "Dra. Ana", "data": "2026-05-10T14:00:00Z" } ] },
*             "semConsultas": { "value": { "message": "Nenhuma consulta encontrada para este paciente.", "consultas": [] } }
*           } } }
*         },
*         "404": {
*           "description": "Paciente não encontrado",
*           "content": { "application/json": { "example": { "error": "Paciente não encontrado" } } }
*         }
*       }
*     }
*   },
*   "/agendamentos/{id}": {
*     "put": {
*       "summary": "Remarcar data da consulta",
*       "description": "Altera a data/hora de uma consulta existente.",
*       "tags": ["Agendamentos"],
*       "parameters": [
*         { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "ID da consulta" }
*       ],
*       "requestBody": {
*         "required": true,
*         "content": {
*           "application/json": {
*             "schema": {
*               "type": "object",
*               "properties": {
*                 "novaData": { "type": "string", "format": "date-time", "description": "Nova data/hora da consulta", "example": "2026-05-11T10:00:00Z" }
*               },
*               "required": ["novaData"]
*             }
*           }
*         }
*       },
*       "responses": {
*         "200": {
*           "description": "Consulta remarcada com sucesso",
*           "content": { "application/json": { "example": { "id": 1, "pacienteId": 1, "medicoId": 2, "data": "2026-05-11T10:00:00Z" } } }
*         },
*         "400": {
*           "description": "Erro de validação ou data retroativa",
*           "content": { "application/json": { "example": { "error": "Não é possível remarcar para uma data passada." } } }
*         },
*         "404": {
*           "description": "Consulta não encontrada",
*           "content": { "application/json": { "example": { "error": "Consulta não encontrada" } } }
*         }
*       }
*     },
*     "delete": {
*       "summary": "Cancelar uma consulta",
*       "description": "Remove uma consulta existente pelo ID.",
*       "tags": ["Agendamentos"],
*       "parameters": [
*         { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "ID da consulta" }
*       ],
*       "responses": {
*         "204": { "description": "Consulta cancelada com sucesso" },
*         "404": {
*           "description": "Consulta não encontrada",
*           "content": { "application/json": { "example": { "error": "Consulta não encontrada" } } }
*         }
*       }
*     }
*   }
* }
*/

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

// POST /agendamentos - Agenda uma nova consulta
router.post("/", async (req, res) => {
  try {
    const novaConsulta = await agendarConsulta(req.body);
    return res.status(201).json(novaConsulta);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// GET /agendamentos - Lista todas as consultas agendadas
router.get("/", async (req, res) => {
  try {
    const consultas = await listarTodasConsultas();
    return res.json(consultas);
  } catch (error) {
    return handleRouteError(res, error);
  }
});

// GET /agendamentos/paciente/:pacienteId - Lista consultas de um paciente específico
router.get("/paciente/:pacienteId", async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const consultas = await listarConsultasPorPaciente(Number(pacienteId));
    if (!consultas || consultas.length === 0) {
      return res.json({ message: "Nenhuma consulta encontrada para este paciente.", consultas: [] });
    }
    return res.json(consultas);
  } catch (error: any) {
    if (error.type === 'NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    return handleRouteError(res, error);
  }
});

// PUT /agendamentos/:id - Altera a data de uma consulta existente
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

// DELETE /agendamentos/:id - Cancela uma consulta pelo ID
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