// src/routes/agendamentos.ts
import { Router } from 'express';
import { agendarConsulta } from '../services/agendamentoService';

const router = Router();

// POST /agendamentos - Esqueleto funcional
router.post('/', async (req, res) => {
  try {
    const result = await agendarConsulta();
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
