/**
* @swagger
* {
*   "/pacientes": {
*     "get": {
*       "summary": "Listar todos os pacientes",
*       "description": "Retorna todos os pacientes cadastrados.",
*       "tags": ["Pacientes"],
*       "responses": {
*         "200": {
*           "description": "Lista de pacientes",
*           "content": { "application/json": { "example": [ { "id": 1, "nome": "João", "cpf": "12345678901", "dataNascimento": "1980-01-01", "email": "joao@email.com", "dataCriacao": "2026-05-10T14:00:00Z" } ] } }
*         }
*       }
*     },
*     "post": {
*       "summary": "Cadastrar paciente",
*       "description": "Adiciona um novo paciente ao sistema.",
*       "tags": ["Pacientes"],
*       "requestBody": {
*         "required": true,
*         "content": {
*           "application/json": {
*             "schema": {
*               "type": "object",
*               "properties": {
*                 "nome": { "type": "string", "description": "Nome completo do paciente" },
*                 "cpf": { "type": "string", "description": "CPF do paciente" },
*                 "email": { "type": "string", "description": "E-mail do paciente" },
*                 "dataNascimento": { "type": "string", "format": "date", "description": "Data de nascimento (YYYY-MM-DD)", "example": "1980-01-01" }
*               },
*               "required": ["nome", "cpf", "email", "dataNascimento"]
*             }
*           }
*         }
*       },
*       "responses": {
*         "201": {
*           "description": "Paciente cadastrado",
*           "content": { "application/json": { "example": { "id": 1, "nome": "João", "cpf": "12345678901", "dataNascimento": "1980-01-01", "email": "joao@email.com", "dataCriacao": "2026-05-10T14:00:00Z" } } }
*         },
*         "400": {
*           "description": "Erro na validação",
*           "content": { "application/json": { "example": { "error": "O CPF deve ter exatamente 11 números." } } }
*         },
*         "409": {
*           "description": "Conflito: CPF já cadastrado",
*           "content": { "application/json": { "example": { "error": "CPF já existe" } } }
*         }
*       }
*     }
*   },
*   "/pacientes/{id}": {
*     "put": {
*       "summary": "Atualizar dados de um paciente",
*       "description": "Atualiza as informações de um paciente existente.",
*       "tags": ["Pacientes"],
*       "parameters": [
*         { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "ID do paciente" }
*       ],
*       "requestBody": {
*         "description": "Todos os campos são opcionais. Envie apenas as propriedades que deseja alterar.",
*         "content": {
*           "application/json": {
*             "schema": {
*               "type": "object",
*               "properties": {
*                 "nome": { "type": "string", "example": "Alessandro Rosario" },
*                 "cpf": { "type": "string", "example": "12345678901" },
*                 "email": { "type": "string", "example": "alessandro@email.com" },
*                 "dataNascimento": { "type": "string", "format": "date", "example": "1980-01-01" }
*               }
*             }
*           }
*         }
*       },
*       "responses": {
*         "200": {
*           "description": "Paciente atualizado com sucesso",
*           "content": { "application/json": { "example": { "id": 1, "nome": "João", "cpf": "12345678901", "dataNascimento": "1980-01-01", "email": "joao@email.com", "dataCriacao": "2026-05-10T14:00:00Z" } } }
*         },
*         "400": {
*           "description": "Erro na validação",
*           "content": { "application/json": { "example": { "error": "O CPF deve ter exatamente 11 números." } } }
*         },
*         "404": {
*           "description": "Paciente não encontrado",
*           "content": { "application/json": { "example": { "error": "Paciente não encontrado" } } }
*         },
*         "409": {
*           "description": "Conflito: Novo CPF já está em uso",
*           "content": { "application/json": { "example": { "error": "CPF já existe" } } }
*         }
*       }
*     },
*     "delete": {
*       "summary": "Remover um paciente",
*       "description": "Remove um paciente existente pelo ID.",
*       "tags": ["Pacientes"],
*       "parameters": [
*         { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "ID do paciente" }
*       ],
*       "responses": {
*         "204": { "description": "Paciente removido com sucesso" },
*         "404": {
*           "description": "Paciente não encontrado",
*           "content": { "application/json": { "example": { "error": "Paciente não encontrado" } } }
*         }
*       }
*     }
*   }
* }
*/

import { Router } from "express";
import {
  atualizarPaciente,
  cadastrarPaciente,
  listarPacientes,
  excluirPaciente
} from "../services/pacienteService";
import { handleRouteError } from "../utils/errorHandler";

const router = Router();

// Cria um novo paciente
router.post("/", async (req, res) => {
  try {
    const { nome, cpf, dataNascimento, email } = req.body;
    const paciente = await cadastrarPaciente({ nome, cpf, dataNascimento, email });
    res.status(201).json(paciente);
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

// Lista todos os pacientes cadastrados
router.get("/", async (_req, res) => {
  try {
    const pacientes = await listarPacientes();
    res.json(pacientes);
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

// Atualiza os dados de um paciente existente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, dataNascimento, email } = req.body;
    const paciente = await atualizarPaciente(Number(id), { nome, cpf, dataNascimento, email });
  
    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }
    res.json(paciente);
    
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

// Remove um paciente pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await excluirPaciente(Number(id));
    if (!deleted) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }
    res.json({ message: "Paciente excluído com sucesso" });
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

export default router;
