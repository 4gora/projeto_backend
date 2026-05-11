# SGHSS VidaPlus
--- 
## Descrição do Sistema

O **SGHSS VidaPlus** é um backend REST desenvolvido em Node.js e TypeScript para agendamentos e cadastros hospitalares. O sistema centraliza a persistência de dados em um banco relacional PostgreSQL, operando em container via Docker.

### Funcionalidades e Implementação

* **Gestão de Fluxo:** Implementa CRUDs para pacientes e médicos com validação de integridade referencial diretamente no esquema do banco de dados.
* **Regras de Negócio:** Valida conflitos de horários em nível de serviço (Services), impedindo registros duplicados no mesmo intervalo temporal para o mesmo profissional.
* **Interface de Testes:** Documentação e execução de chamadas via Swagger UI, seguindo a especificação OpenAPI 3.0.
* **Qualidade de Software:** Cobertura de testes de integração com Jest e Supertest para validação de códigos de status HTTP (201, 404, 409).
* **Infraestrutura:** Orquestração de serviços (App e DB) via Docker Compose, garantindo isolamento de dependências e paridade de ambiente.


<img style="display: block; margin: auto;" src="docs/img/diagrama_de_classe.svg" alt="diagrama de classe" width="400">

## Pré-requisitos

- Node.js v18 ou superior
- Docker e Docker Compose
- npm

## Passo a Passo para Execução

1. Instale as dependências:
	```bash
	npm install
	```
2. Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente conforme necessário.
3. Inicie os serviços com Docker Compose:
	```bash
	docker-compose up --build
	```

## Testes

Para rodar os testes automatizados, utilize o comando abaixo em um segundo terminal:

```bash
npm test
```

Os testes avaliam possíveis sucessos e erros, incluindo respostas 409 (conflito) e 404 (não encontrado).

## Interface de Documentação

Acesse a documentação Swagger em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Tecnologias Utilizadas

- TypeScript
- PostgreSQL
- Docker
- Jest

## Estrutura de Pastas (`src/`)

- `routes/` — Rotas da aplicação
- `services/` — Lógica de negócio
- `utils/` — Utilitários
- `tests/` — Testes automatizados
- `entities/` — Modelos de dados
