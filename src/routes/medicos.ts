/**
* @swagger
* {
*   "/medicos": {
*     "get": {
*       "summary": "Listar todos os médicos",
*       "description": "Retorna todos os médicos cadastrados.",
*       "tags": ["Médicos"],
*       "responses": {
*         "200": {
*           "description": "Lista de médicos",
*           "content": { "application/json": { "example": [ { "id": 1, "nome": "Dra. Ana", "crm": "1234567890", "email": "ana@email.com", "dataCriacao": "2026-05-10T14:00:00Z" } ] } }
*         }
*       }
*     },
*     "post": {
*       "summary": "Cadastrar um novo médico",
*       "description": "Adiciona um novo médico ao sistema.",
*       "tags": ["Médicos"],
*       "requestBody": {
*         "required": true,
*         "content": {
*           "application/json": {
*             "schema": {
*               "type": "object",
*               "properties": {
*                 "nome": { "type": "string", "description": "Nome completo do médico" },
*                 "crm": { "type": "string", "description": "CRM do médico" },
*                 "email": { "type": "string", "description": "E-mail do médico" }
*               },
*               "required": ["nome", "crm", "email"]
*             }
*           }
*         }
*       },
*       "responses": {
*         "201": {
*           "description": "Médico cadastrado",
*           "content": { "application/json": { "example": { "id": 1, "nome": "Dra. Ana", "crm": "1234567890", "email": "ana@email.com", "dataCriacao": "2026-05-10T14:00:00Z" } } }
*         },
*         "400": {
*           "description": "Erro na validação",
*           "content": { "application/json": { "example": { "error": "O CRM deve ter exatamente 10 números." } } }
*         },
*         "409": {
*           "description": "CRM já existe",
*           "content": { "application/json": { "example": { "error": "CRM já existe" } } }
*         }
*       }
*     }
*   },
*   "/medicos/{id}": {
*     "put": {
*       "summary": "Atualizar dados de um médico",
*       "description": "Atualiza as informações de um médico existente.",
*       "tags": ["Médicos"],
*       "parameters": [
*         { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "ID do médico" }
*       ],
*       "requestBody": {
*         "description": "Todos os campos são opcionais. Envie apenas as propriedades que deseja alterar.",
*         "content": {
*           "application/json": {
*             "schema": {
*               "type": "object",
*               "properties": {
*                 "nome": { "type": "string", "example": "Dr. Alessandro Rosario" },
*                 "crm": { "type": "string", "example": "1234567890" },
*                 "email": { "type": "string", "example": "alessandro@email.com" }
*               }
*             }
*           }
*         }
*       },
*       "responses": {
*         "200": {
*           "description": "Médico atualizado com sucesso",
*           "content": { "application/json": { "example": { "id": 1, "nome": "Dra. Ana", "crm": "1234567890", "email": "ana@email.com", "dataCriacao": "2026-05-10T14:00:00Z" } } }
*         },
*         "400": {
*           "description": "Erro na validação",
*           "content": { "application/json": { "example": { "error": "O CRM deve ter exatamente 10 números." } } }
*         },
*         "404": {
*           "description": "Médico não encontrado",
*           "content": { "application/json": { "example": { "error": "Médico não encontrado" } } }
*         },
*         "409": {
*           "description": "CRM já existe",
*           "content": { "application/json": { "example": { "error": "CRM já existe" } } }
*         }
*       }
*     },
*     "delete": {
*       "summary": "Remover um médico",
*       "description": "Remove um médico existente pelo ID.",
*       "tags": ["Médicos"],
*       "parameters": [
*         { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "ID do médico" }
*       ],
*       "responses": {
*         "204": { "description": "Médico removido com sucesso" },
*         "404": {
*           "description": "Médico não encontrado",
*           "content": { "application/json": { "example": { "error": "Médico não encontrado" } } }
*         }
*       }
*     }
*   }
* }
*/

import { Router } from "express";
import {
  cadastrarMedico,
  atualizarMedico,
  excluirMedico,
  listarMedicos,
} from "../services/medicoService";
import { handleRouteError } from "../utils/errorHandler";

const router = Router();

// Cria um novo médico
router.post("/", async (req, res) => {
  try {
    const { nome, crm, email } = req.body;
    const medico = await cadastrarMedico({ nome, crm, email });
    res.status(201).json(medico);
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

// Lista todos os médicos cadastrados
router.get("/", async (_req, res) => {
  try {
    const medicos = await listarMedicos();
    res.json(medicos);
  } catch (error: any) {
    handleRouteError(res, error);
  }
});
  
// Atualiza os dados de um médico existente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, crm, email } = req.body;
    const medico = await atualizarMedico(Number(id), { nome, crm, email });
    
    if (!medico) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }
    res.json(medico);

  } catch (error: any) {
    handleRouteError(res, error);
  }
});

// Remove um médico pelo ID
router.delete(":id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await excluirMedico(Number(id));
    if (!deleted) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }
    res.json({ message: "Médico excluído com sucesso" });
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

export default router;