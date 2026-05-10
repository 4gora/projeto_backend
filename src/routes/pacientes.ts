/**
* @swagger
* {
*     "/pacientes": {
*         "get": {
*             "summary": "Listar pacientes",
*             "tags": [
*                 "Pacientes"
*             ],
*             "responses": {
*                 "200": {
*                     "description": "Sucesso"
*                 }
*             }
*         },
*         "post": {
*             "summary": "Cadastrar paciente",
*             "tags": [
*                 "Pacientes"
*             ],
*             "requestBody": {
*                 "required": true,
*                 "content": {
*                     "application/json": {
*                         "schema": {
*                             "type": "object",
*                             "properties": {
*                                 "nome": {
*                                     "type": "string"
*                                 },
*                                 "cpf": {
*                                     "type": "string"
*                                 },
*                                 "email": {
*                                     "type": "string"
*                                 },
*                                 "dataNascimento": {
*                                     "type": "string",
*                                     "format": "date",
*                                     "example": "1980-01-01"
*                                 }
*                             }
*                         }
*                     }
*                 }
*             },
*             "responses": {
*                 "201": {
*                     "description": "Paciente cadastrado"
*                 },
*                 "400": {
*                     "description": "Erro na validação"
*                 },
*                 "409": {
*                     "description": "Conflito: CPF já cadastrado"
*                 }
*             }
*         }
*     },
*     "/pacientes/{id}": {
*         "put": {
*             "summary": "Atualizar dados de um paciente",
*             "tags": [
*                 "Pacientes"
*             ],
*             "parameters": [
*                 {
*                     "name": "id",
*                     "in": "path",
*                     "required": true,
*                     "schema": {
*                         "type": "integer"
*                     }
*                 }
*             ],
*             "requestBody": {
*                 "description": "Nota: Todos os campos são opcionais. Envie apenas as propriedades que deseja alterar. Os dados não enviados serão preservados conforme o cadastro original.",
*                 "content": {
*                     "application/json": {
*                         "schema": {
*                             "type": "object",
*                             "properties": {
*                                 "nome": {
*                                     "type": "string",
*                                     "example": "Alessandro Rosario"
*                                 },
*                                 "cpf": {
*                                     "type": "string",
*                                     "example": "12345678901"
*                                 },
*                                 "email": {
*                                     "type": "string",
*                                     "example": "alessandro@email.com"
*                                 },
*                                 "dataNascimento": {
*                                     "type": "string",
*                                     "format": "date",
*                                     "example": "1980-01-01"
*                                 }
*                             }
*                         }
*                     }
*                 }
*             },
*             "responses": {
*                 "200": {
*                     "description": "Paciente atualizado com sucesso"
*                 },
*                 "400": {
*                     "description": "Erro na validação"
*                 },
*                 "404": {
*                     "description": "Paciente não encontrado"
*                 },
*                 "409": {
*                     "description": "Conflito: Novo CPF já está em uso"
*                 }
*             }
*         },
*         "delete": {
*             "summary": "Remover um paciente",
*             "tags": [
*                 "Pacientes"
*             ],
*             "parameters": [
*                 {
*                     "name": "id",
*                     "in": "path",
*                     "required": true,
*                     "schema": {
*                         "type": "integer"
*                     }
*                 }
*             ],
*             "responses": {
*                 "204": {
*                     "description": "Paciente removido com sucesso"
*                 },
*                 "404": {
*                     "description": "Paciente não encontrado"
*                 }
*             }
*         }
*     }
* }
*/

// src/routes/pacientes.ts
import { Router } from "express";
import {
  atualizarPaciente,
  cadastrarPaciente,
  listarPacientes,
  excluirPaciente
} from "../services/pacienteService";
import { handleRouteError } from "../utils/errorHandler";

const router = Router();

// POST /pacientes - Cadastrar paciente
router.post("/", async (req, res) => {
  try {
    const { nome, cpf, dataNascimento, email } = req.body;
    const paciente = await cadastrarPaciente({ nome, cpf, dataNascimento, email });
    res.status(201).json(paciente);
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

// GET /pacientes - Listar pacientes
router.get("/", async (_req, res) => {
  try {
    const pacientes = await listarPacientes();
    res.json(pacientes);
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

// PUT /pacientes/:id - Atualizar um paciente
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

// DELETE /pacientes/:id - Excluir um paciente
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
