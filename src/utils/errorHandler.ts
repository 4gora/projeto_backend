import { Response } from 'express';

export const handleRouteError = (res: Response, error: any) => {
  // Erro de Duplicidade no Postgres (Unique Constraint)
  if (error.code === '23505') {
    return res.status(409).json({ error: 'Conflito: Este registro (CPF, CRM ou E-mail) já existe.' });
  }

  // Erro de Validação de Tamanho/Tipo
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }

  // Erro Genérico
  console.error("Erro não tratado:", error);
  return res.status(500).json({ error: 'Erro interno no servidor.' });
};