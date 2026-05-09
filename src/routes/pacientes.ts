// src/routes/pacientes.ts
import { Router } from 'express';
import { cadastrarPaciente, listarPacientes } from '../services/pacienteService';

const router = Router();

// POST /pacientes - Cadastrar paciente
router.post('/', async (req, res) => {
  try {
    const { nome, cpf, email } = req.body;
    const paciente = await cadastrarPaciente({ nome, cpf, email, dataCriacao: new Date() });
    res.status(201).json(paciente);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /pacientes - Listar pacientes
router.get('/', async (_req, res) => {
  try {
    const pacientes = await listarPacientes();
    res.json(pacientes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
