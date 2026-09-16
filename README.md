<div align="center">
<img src="docs/assets/condoreservas-logo.png" alt="CondoReservas" width="420">

# CondoReservas

### Sistema de gerenciamento e reservas para áreas comuns de condomínios

</div>

---

## P2 — SQLite + Prisma ORM 6 + React/Vite/Tailwind

A implementação original da P1 foi preservada: entidades, casos de uso, controllers, autenticação por token, validações, Swagger e contratos dos repositórios continuam no projeto.

Nesta etapa foram adicionados:

- **SQLite** como banco de dados local;
- **Prisma ORM 6** para persistência;
- implementações `PrismaRepositorioUsuario`, `PrismaRepositorioEspaco` e `PrismaRepositorioReserva`;
- migração Prisma e seed de demonstração;
- **React + Vite** no frontend;
- **Tailwind CSS** para a interface;
- integração completa do frontend com a API;
- telas de login, cadastro, espaços, detalhe do espaço, minhas reservas, aprovações, usuários e perfil;
- CORS para desenvolvimento frontend/backend em portas diferentes.

### Estrutura

```text
reservas_area_comum/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── entities/
│   │   ├── use-cases/
│   │   ├── repositories/
│   │   ├── interfaces/
│   │   ├── infrastructure/
│   │   │   └── database/
│   │   │       ├── prismaClient.ts
│   │   │       ├── PrismaRepositorioUsuario.ts
│   │   │       ├── PrismaRepositorioEspaco.ts
│   │   │       ├── PrismaRepositorioReserva.ts
│   │   │       └── ...implementações em memória da P1
│   │   └── factories/
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── tailwind.config.js
│   └── vite.config.js
└── docs/
    ├── assets/
    └── wireframe/
```

## Como executar

### 1. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

API: `http://localhost:3001`

Swagger: `http://localhost:3001/api/docs`

Banco SQLite: `backend/prisma/dev.db`

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite exibirá o endereço local do frontend, normalmente `http://localhost:5173`.

Se a API estiver em outro endereço, crie `frontend/.env` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

## Usuários de demonstração

O seed cria:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Morador | `morador@condominio.com` | `senha123` |
| Zelador | `zelador@condominio.com` | `senha123` |

## Observações sobre Prisma 6

O projeto usa `prisma` e `@prisma/client` na série **6.x**. Não foram utilizados recursos específicos do Prisma 7.

Os repositórios em memória da P1 foram mantidos para não apagar o trabalho anterior, mas a factory principal agora injeta as implementações Prisma, fazendo com que os dados sobrevivam ao reinício do servidor.

## Regras de negócio preservadas

- Reserva com no mínimo 3 horas de antecedência.
- Um morador não pode ter mais de uma reserva ativa no mesmo dia.
- Reservas ativas não podem se sobrepor no mesmo espaço.
- Toda nova reserva começa como `PENDENTE`.
- Cancelamentos solicitados pelo morador dependem da decisão do zelador.

## API principal

- `POST /usuarios`
- `POST /autenticacao/entrar`
- `GET /usuarios/me`
- `GET /usuarios`
- `GET /espacos`
- `POST /espacos`
- `GET /espacos/:espacoId`
- `PATCH /espacos/:espacoId`
- `DELETE /espacos/:espacoId`
- `POST /espacos/:espacoId/reservas`
- `GET /espacos/:espacoId/reservas`
- `GET /espacos/:espacoId/disponibilidade`
- `GET /reservas/minhas`
- `GET /reservas/pendentes`
- `GET /reservas/cancelamentos-pendentes`
- `PATCH /reservas/:reservaId/aprovacao`
- `PATCH /reservas/:reservaId/recusa`
- `POST /reservas/:reservaId/cancelamento`
- `PATCH /reservas/:reservaId/cancelamento/aprovacao`
- `PATCH /reservas/:reservaId/cancelamento/recusa`
