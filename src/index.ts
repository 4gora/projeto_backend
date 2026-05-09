import express from 'express';
import pacientesRouter from './routes/pacientes';
import agendamentosRouter from './routes/agendamentos';
import { initPacienteTable } from './services/pacienteService';

//#TODO: Incluir Swagger para documentação automática das APIs

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Inicialização do banco e tabelas
initPacienteTable()
  .then(() => {
    console.log('Tabela de pacientes pronta.');
  })
  .catch((err) => {
    console.error('Erro ao inicializar tabela de pacientes:', err);
    process.exit(1);
  });

// Rotas principais
app.use('/pacientes', pacientesRouter);
app.use('/agendamentos', agendamentosRouter);

// Rota de status
app.get('/', (_req, res) => {
  res.send('SGHSS VidaPlus API rodando.');
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
