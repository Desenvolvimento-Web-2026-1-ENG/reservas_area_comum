# Backend — CondoReservas

Backend da aplicação CondoReservas. A P2 mantém a arquitetura da P1 e troca a implementação principal dos repositórios em memória por **SQLite + Prisma ORM 6**.

## Executar

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Servidor: `http://localhost:3001`

Swagger: `http://localhost:3001/api/docs`

## Banco

O arquivo SQLite é criado em:

```text
backend/prisma/dev.db
```

A variável está em `.env`:

```env
DATABASE_URL="file:./dev.db"
```

Como o `schema.prisma` está em `backend/prisma`, o caminho relativo aponta para `backend/prisma/dev.db`.

## Prisma 6

Este projeto usa:

- `prisma` 6.x
- `@prisma/client` 6.x
- SQLite

Principais comandos:

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run prisma:studio
```

## Repositórios

Os contratos existentes continuam em `src/repositories`.

Implementações da P2:

- `src/infrastructure/database/PrismaRepositorioUsuario.ts`
- `src/infrastructure/database/PrismaRepositorioEspaco.ts`
- `src/infrastructure/database/PrismaRepositorioReserva.ts`

As implementações `*EmMemoria.ts` da P1 foram preservadas, mas não são mais usadas pela factory principal.

## Autenticação

As rotas protegidas usam:

```http
Authorization: Bearer <token>
```

O token continua sendo gerado pelo serviço de sessão em memória da P1. O requisito de persistência da P2 é aplicado aos dados de usuários, espaços e reservas; a sessão não precisa ser armazenada no SQLite.

## Endpoints

Consulte `openapi.json` ou o Swagger para a documentação completa.

Além das rotas originais, a P2 disponibiliza:

```text
GET /reservas/cancelamentos-pendentes
```

para que o frontend apresente a seção de cancelamentos solicitados pelo morador ao zelador.
