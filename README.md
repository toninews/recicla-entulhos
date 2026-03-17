# Recicla Entulhos

MVP full stack para gestão de caçambas e aluguéis, desenvolvido para teste técnico com foco em entrega rápida, organização e funcionamento ponta a ponta.

## Contexto do Desafio

Este projeto foi desenvolvido como solução para um teste técnico com a proposta de modernizar o controle operacional da empresa fictícia **Recicla Entulhos**, que atualmente realiza a gestão de caçambas em agenda física.

O objetivo da entrega foi construir um **MVP funcional**, com arquitetura simples, código organizado e fluxo completo funcionando de ponta a ponta, priorizando:

- cadastro de caçambas
- listagem com filtros
- fluxo de aluguel
- integração com ViaCEP
- histórico de locações

## Visão Geral

O sistema moderniza o controle operacional da Recicla Entulhos, substituindo o uso de agenda física por uma aplicação web com:

- cadastro e manutenção de caçambas
- listagem com filtros
- fluxo de aluguel com atualização automática de status
- consulta de endereço por CEP com ViaCEP
- histórico completo de locações

## Stack

- Frontend: Next.js + React
- Backend: NestJS
- ORM: Prisma
- Banco de dados: PostgreSQL
- Documentação da API: Swagger
- Infra: Docker e Docker Compose

## O Que Foi Entregue

### Backend

- API REST com NestJS
- persistência com Prisma ORM
- PostgreSQL como banco de dados
- documentação automática com Swagger
- validações básicas de entrada
- regras de negócio para disponibilidade, aluguel, encerramento e histórico

### Frontend

- login fake seguindo a proposta do teste
- listagem de caçambas com filtros
- tela separada para criação de caçamba
- tela separada para edição de caçamba
- tela de aluguel por caçamba
- tela de histórico geral
- tela de histórico por caçamba
- integração completa com a API
- consulta de CEP via ViaCEP
- interface responsiva com foco em clareza e uso operacional

### Infraestrutura

- Dockerfile para frontend e backend
- Docker Compose para subir aplicação completa
- migration inicial com Prisma
- README com instruções de execução e decisões do projeto

## Estrutura do Projeto

```text
recicla-entulhos/
  backend/   # API NestJS + Prisma
  frontend/  # Aplicação Next.js
  docs/      # Documentação de apoio
```

## Funcionalidades Entregues

### Prioridade máxima

- CRUD de caçambas
- listagem com filtros por número de série, cor e status
- criação de aluguel vinculando uma caçamba disponível
- atualização automática do status da caçamba para `RENTED`
- encerramento do aluguel com retorno da caçamba para `AVAILABLE`
- consulta de CEP via ViaCEP
- histórico completo de aluguéis
- histórico por caçamba
- fluxo de aluguel a partir da caçamba selecionada

### Prioridade média

- interface simples, responsiva e organizada
- validações básicas no backend
- login fake no frontend para entrada no sistema
- feedbacks de UX com toasts e confirmações de ações críticas

## Modelagem

### Dumpster

- `id`
- `serialNumber`
- `color`
- `status`
- `createdAt`
- `updatedAt`

### Rental

- `id`
- `customerName`
- `customerPhone`
- `zipCode`
- `street`
- `number`
- `complement`
- `district`
- `city`
- `state`
- `reference`
- `startDate`
- `endDate`
- `finishedAt`
- `notes`
- `status`
- `dumpsterId`
- `createdAt`
- `updatedAt`

## Regras de Negócio

- número de série da caçamba é único
- apenas caçambas disponíveis podem ser alugadas
- ao criar aluguel, a caçamba passa para `RENTED`
- ao encerrar aluguel, a caçamba volta para `AVAILABLE`
- `startDate` registra o momento real da criação do aluguel
- `endDate` representa a previsão de término
- `finishedAt` registra o encerramento real do aluguel
- não é permitido editar ou excluir caçamba alugada
- não é permitido excluir caçamba com histórico de aluguel
- o histórico é mantido na tabela de aluguéis

## Endpoints Principais

### Caçambas

- `POST /api/dumpsters`
- `GET /api/dumpsters`
- `GET /api/dumpsters/:id`
- `PATCH /api/dumpsters/:id`
- `DELETE /api/dumpsters/:id`

### Aluguéis

- `POST /api/rentals`
- `GET /api/rentals`
- `GET /api/rentals/history`
- `GET /api/rentals/history?dumpsterId=UUID`
- `PATCH /api/rentals/:id/finish`

### ViaCEP

- `GET /api/viacep/:zipCode`

## Fluxo Principal do Sistema

1. O usuário acessa o login fake e entra no sistema.
2. Cadastra uma nova caçamba com número de série e cor.
3. Visualiza as caçambas na listagem e pode filtrar por série, cor e status.
4. A partir da caçamba, acessa a tela de aluguel.
5. Informa o CEP e o sistema consulta o ViaCEP para preencher o endereço.
6. Confirma o aluguel e a caçamba muda automaticamente para `Alugada`.
7. A caçamba passa a ter histórico rastreável, com início, previsão e encerramento real.
8. Ao encerrar o aluguel, a caçamba volta para `Disponível`.

## Como Executar com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Passos

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

As credenciais padrão do PostgreSQL já estão definidas no arquivo de exemplo:

- Banco: `recicla_entulhos`
- Usuário: `postgres`
- Senha: `postgres`
- Porta do banco: `5432`
- Porta do backend: `3001`
- Porta do frontend: `3000`

2. Suba os serviços:

```bash
docker compose up --build
```

3. Acesse a aplicação:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`

Observação:

- o backend executa `prisma migrate deploy` ao iniciar o container

## Como Validar no Navegador

Após subir o projeto com Docker:

- Frontend: `http://localhost:3000`
- Swagger: `http://localhost:3001/api/docs`

Fluxo sugerido para avaliação:

1. Entrar no sistema pela tela de login.
2. Cadastrar uma nova caçamba.
3. Verificar a listagem e os filtros.
4. Editar uma caçamba disponível.
5. Clicar em `Alugar` a partir da caçamba.
6. Informar um CEP válido e validar o preenchimento automático do endereço.
7. Confirmar o aluguel e verificar a mudança de status.
8. Acessar o histórico da caçamba.
9. Encerrar o aluguel e validar o retorno para `Disponível`.

## Como Executar Localmente

### Backend

1. Configure as variáveis de ambiente:

```bash
cp backend/.env.example backend/.env
```

Para execução local do backend, o projeto espera um PostgreSQL rodando com:

- Banco: `recicla_entulhos`
- Usuário: `postgres`
- Senha: `postgres`
- Host: `localhost`
- Porta: `5432`

2. Instale as dependências:

```bash
cd backend
corepack pnpm install
```

3. Gere o Prisma Client e aplique o banco:

```bash
corepack pnpm prisma generate
corepack pnpm prisma migrate deploy
```

4. Inicie o backend:

```bash
corepack pnpm start:dev
```

### Frontend

1. Configure as variáveis de ambiente:

```bash
cp frontend/.env.example frontend/.env.local
```

O frontend consome a API em:

- `http://localhost:3001/api`

2. Instale as dependências:

```bash
cd frontend
corepack pnpm install
```

3. Inicie o frontend:

```bash
corepack pnpm dev
```

## Telas do Frontend

- `/login`: login fake inspirado no mockup
- `/cacambas`: listagem, filtros e ações principais
- `/cacambas/nova`: criação de caçamba
- `/cacambas/[id]`: edição de caçamba
- `/alugueis`: visão operacional de aluguéis ativos e criação manual
- `/alugueis/[dumpsterId]`: aluguel da caçamba selecionada
- `/historico`: histórico geral das locações
- `/historico/[dumpsterId]`: histórico da caçamba selecionada

## Decisões de Projeto

- foco em MVP funcional, sem overengineering
- autenticação simulada apenas no frontend
- sem paginação e sem controle de permissões avançado
- sem features extras fora do escopo crítico
- status da caçamba simplificado para `Disponível` e `Alugada`, aderente ao enunciado
- criação e edição separadas no frontend para maior aderência às telas pedidas
- histórico por caçamba implementado para rastreabilidade operacional
- interface pensada para uso rápido, com bloqueio visual e lógico de ações inconsistentes

## Segurança

- Os identificadores expostos pela API para `Dumpster` e `Rental` são UUIDs, reduzindo risco de enumeração simples por IDs sequenciais previsíveis.
- O projeto não expõe `AUTO_INCREMENT` em rotas, responses ou frontend.
- Essa decisão ajuda a mitigar cenários clássicos de OWASP relacionados a enumeração de recursos, como IDOR e BOLA, mas UUID sozinho não substitui autorização.
- Neste MVP, o mesmo identificador UUID é usado como identificador persistido e público, o que simplifica a arquitetura sem expor IDs incrementais.
- Em uma evolução do sistema, uma estratégia válida seria manter `id` numérico para uso interno de banco e `public_id` em UUID/ULID para uso externo.
- A validação de autorização deve acontecer sempre no backend, garantindo que o usuário autenticado possa acessar ou alterar apenas os recursos permitidos para ele.
- Como este teste utiliza login fake sem autenticação/autorização real no backend, a mitigação completa contra IDOR/BOLA dependeria da adição de autenticação e de regras de acesso por recurso.

## Pontos de Atenção e Evoluções Naturais

Como o foco da entrega foi um MVP para teste técnico com tempo limitado, algumas evoluções ficaram propositalmente fora do escopo:

- autenticação e autorização reais
- cadastro formal de clientes para reutilização de dados
- paginação e ordenação avançada
- notificações de vencimento de aluguel
- renovação de aluguel
- testes automatizados

Esses pontos podem ser evoluídos sem necessidade de reestruturar a base atual.

## Status da Entrega

- Etapa 1 concluída: arquitetura e modelagem
- Etapa 2 concluída: backend completo
- Etapa 3 concluída: frontend funcional
- Etapa 4 concluída: integração, dockerização e documentação

## Referências

- Arquitetura inicial: `docs/etapa-1-arquitetura.md`
