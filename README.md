# SGHSS VidaPlus

## Objetivos
* Implementar o back-end de um Sistema de Gestão Hospitalar e de Saúde Sustentável.
* Garantir persistência de dados e escalabilidade via arquitetura de containers.

## Tecnologias utilizadas
* **Linguagem:** TypeScript / Node.js.
* **Banco de Dados:** PostgreSQL.
* **Infraestrutura:** Docker e Docker Compose.
* **API:** Express.

## Características
* **Arquitetura:** Camadas (Entities, Services, Routes) para separação de responsabilidades.
* **Segurança:** Validação de chaves únicas (CPF/CRM) e integridade referencial.
* **Auditoria:** Registro de logs de criação e modificação de registros sensíveis.
* **Ambiente:** Execução isolada que garante paridade entre desenvolvimento e produção.

## Funcionalidades
* **Gestão de Pacientes:** Cadastro e listagem com validação de documentos.
* **Gestão de Profissionais:** Registro de médicos por especialidade e CRM.
* **Agendamentos:** Estrutura para controle de consultas e telemedicina.
* **Banco de Dados Automático:** Script de inicialização para criação automática das tabelas.