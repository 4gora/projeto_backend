/**
 * @swagger
 * {
 * "/agendamentos": {
 * "post": {
 * "summary": "Agendar uma nova consulta",
 * "tags": ["Agendamentos"],
 * "requestBody": {
 * "required": true,
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "pacienteId": { "type": "integer" },
 * "medicoId": { "type": "integer" },
 * "data": { "type": "string", "format": "date-time" }
 * }
 * }
 * }
 * }
 * },
 * "responses": {
 * "201": { "description": "Consulta agendada com sucesso" },
 * "400": { "description": "Erro no agendamento (Ex: Data retroativa)" }
 * }
 * }
 * }
 * }
 */

// src/routes/agendamentos.ts

import { Router } from 'express';
import { agendarConsulta } from '../services/agendamentoService';

const router = Router();

router.post('/', async (req, res) => {
  try {
    // Pegamos os dados que o usuário enviou
    const { pacienteId, medicoId, data } = req.body;
    
    // Passamos para o service (o Service espera um objeto com esses campos)
    const result = await agendarConsulta({ 
      pacienteId, 
      medicoId, 
      data: new Date(data) 
    });
    
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;