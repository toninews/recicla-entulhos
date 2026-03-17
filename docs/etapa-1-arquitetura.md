# Recicla Entulhos - Etapa 1

## Objetivo do MVP

Entregar em aproximadamente 1 dia um sistema funcional para controle de caçambas e aluguéis, priorizando:

1. CRUD de caçambas
2. Listagem com filtros
3. Fluxo de aluguel
4. Integração com ViaCEP
5. Histórico de aluguéis

## Arquitetura Proposta

Projeto dividido em dois apps principais:

- `backend`: API REST em NestJS com Prisma, PostgreSQL e Swagger
- `frontend`: aplicação Next.js consumindo a API

Infra mínima:

- `docker-compose.yml` na raiz para subir banco, backend e frontend
- PostgreSQL como banco principal

## Estrutura de Pastas

```text
recicla-entulhos/
  backend/
    prisma/
      schema.prisma
    src/
      modules/
        dumpsters/
        rentals/
        viacep/
      common/
    test/
  frontend/
    src/
      app/
        login/
        cacambas/
        alugueis/
        historico/
      components/
      services/
      types/
  docs/
    etapa-1-arquitetura.md
  docker-compose.yml
  README.md
```

## Modelagem do Banco

### Entidade: `Dumpster`

- `id`
- `serialNumber` - único
- `color`
- `status` - `AVAILABLE`, `RENTED`, `MAINTENANCE`
- `createdAt`
- `updatedAt`

### Entidade: `Rental`

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
- `notes`
- `dumpsterId`
- `createdAt`
- `updatedAt`

Observação:

- O histórico de aluguéis será o próprio registro persistido em `Rental`
- Não será necessário apagar histórico ao finalizar um aluguel
- Ao criar aluguel, a caçamba muda para `RENTED`
- Ao encerrar aluguel, a caçamba volta para `AVAILABLE`

## Regras de Negócio

1. Número de série da caçamba deve ser único
2. Apenas caçambas com status `AVAILABLE` podem ser alugadas
3. Consulta de CEP deve preencher logradouro, bairro, cidade e UF
4. Histórico deve listar todos os aluguéis já realizados
5. Exclusão de caçamba deve ser bloqueada se houver aluguel ativo

## Estratégia do Backend

### Módulo `dumpsters`

Responsável por:

- criar caçamba
- listar caçambas
- filtrar por número de série, cor e status
- atualizar dados
- remover caçamba com validação

### Módulo `rentals`

Responsável por:

- criar aluguel
- listar aluguéis
- listar histórico
- encerrar aluguel

### Módulo `viacep`

Responsável por:

- consultar CEP na API ViaCEP
- normalizar resposta para o frontend

## Estratégia do Frontend

Páginas mínimas:

- `/login`: login fake apenas para entrar no sistema
- `/cacambas`: CRUD + filtros
- `/alugueis`: criar aluguel e listar aluguéis ativos
- `/historico`: listar histórico de locações

Componentes mínimos:

- tabela simples
- formulário de caçamba
- formulário de aluguel
- filtro de listagem
- layout com navegação

## Endpoints Planejados

### Caçambas

- `POST /dumpsters`
- `GET /dumpsters`
- `GET /dumpsters/:id`
- `PATCH /dumpsters/:id`
- `DELETE /dumpsters/:id`

Filtros no `GET /dumpsters`:

- `serialNumber`
- `color`
- `status`

### Aluguéis

- `POST /rentals`
- `GET /rentals`
- `GET /rentals/history`
- `PATCH /rentals/:id/finish`

Filtros no `GET /rentals`:

- `status=active|finished`
- `dumpsterId`
- `customerName`

### ViaCEP

- `GET /viacep/:zipCode`

## Fluxo Principal de Aluguel

1. Usuário acessa tela de aluguéis
2. Informa CEP
3. Frontend consulta `GET /viacep/:zipCode`
4. Usuário completa número e complemento
5. Seleciona uma caçamba disponível
6. Envia `POST /rentals`
7. Backend cria aluguel e atualiza status da caçamba para `RENTED`
8. Histórico passa a conter esse aluguel

## Decisões para Ganho de Tempo

- Sem autenticação real
- Sem paginação inicialmente
- Sem controle complexo de permissões
- Sem soft delete
- Sem DDD ou camadas excessivas
- Sem mensageria ou cache

## Próxima Etapa

Implementar o backend completo em NestJS com Prisma, Swagger e integração com ViaCEP.
