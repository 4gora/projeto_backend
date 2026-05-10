/**
* @swagger
* {
*     "/medicos": {
*         "get": {
*             "summary": "Listar todos os médicos",
*             "tags": [
*                 "Médicos"
*             ],
*             "responses": {
*                 "200": {
*                     "description": "Sucesso"
*                 }
*             }
*         },
*         "post": {
*             "summary": "Cadastrar um novo médico",
*             "tags": [
*                 "Médicos"
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
*                                 "crm": {
*                                     "type": "string"
*                                 },
*                                 "email": {
*                                     "type": "string"
*                                 }
*                             }
*                         }
*                     }
*                 }
*             },
*             "responses": {
*                 "201": {
*                     "description": "Médico cadastrado"
*                 },
*                 "400": {
*                     "description": "Erro na validação"
*                 },
*                 "409": {
*                    "description": "CRM já existe"
*                }
*             }
*         }
*     },
*     "/medicos/{id}": {
*         "put": {
*             "summary": "Atualizar dados de um médico",
*             "tags": [
*                 "Médicos"
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
*                 "description": "Nota: Todos os campos são opcionais. Envie apenas as propriedades
*                 que deseja alterar. Os dados não enviados serão preservados conforme o cadastro original.",
*                 "content": {
*                     "application/json": {
*                         "schema": {
*                             "type": "object",
*                             "properties": {
                                "nome": { "type": "string", "example": "Dr. Alessandro Rosario" },
                                "crm": { "type": "string", "example": "1234567890" },
                                "email": { "type": "string", "example": "alessandro@email.com" }
                              }
*                         }
*                     }
*                 }
*             },
*             "responses": {
*                 "200": {
*                     "description": "Médico atualizado com sucesso"
*                 },
*                 "404": {
*                     "description": "Médico não encontrado"
*                 },
*                 "409": {
*                    "description": "CRM já existe"
*                }
*             }
*         },
*         "delete": {
*             "summary": "Remover um médico",
*             "tags": [
*                 "Médicos"
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
*                     "description": "Médico removido com sucesso"
*                 },
*                 "404": {
*                     "description": "Médico não encontrado"
*                 }
*             }
*         }
*     }
* }
*/
// src/routes/medicos.ts
import { Router } from "express";
import {
  cadastrarMedico,
  atualizarMedico,
  excluirMedico,
  listarMedicos,
} from "../services/medicoService";
import { handleRouteError } from "../utils/errorHandler";

const router = Router();

// POST /medicos - Cadastrar médico
router.post("/", async (req, res) => {
  try {
    const { nome, crm, email } = req.body;
    const medico = await cadastrarMedico({ nome, crm, email });
    res.status(201).json(medico);
  } catch (error: any) {
    handleRouteError(res, error);
  }
});

// GET /medicos - Listar todos os médicos
router.get("/", async (_req, res) => {
  try {
    const medicos = await listarMedicos();
    res.json(medicos);
  } catch (error: any) {
    handleRouteError(res, error);
  }
});
  
// PUT /medicos/:id - Atualizar um médico
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

// DELETE /medicos/:id - Excluir um médico
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