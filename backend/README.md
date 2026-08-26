# CondoReservas — Backend

Sistema web para gerenciamento de reservas de áreas comuns em condomínios residenciais.

## Como rodar

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em `http://localhost:3001`.

- Documentação Swagger (interativa, testa a API pelo navegador): `http://localhost:3001/api/docs`
- Especificação OpenAPI crua: `http://localhost:3001/openapi.json`

Não é necessário configurar banco de dados nesta etapa: os dados ficam em memória (somem ao reiniciar o servidor).

## Endpoints e autenticação

As requisições com corpo usam `Content-Type: application/json`. As rotas protegidas também exigem
`Authorization: Bearer <token>`. O token é obtido em `POST /autenticacao/entrar` e pode ser
informado pelo botão **Authorize** do Swagger.

| Método | URL | Acesso | Corpo |
| --- | --- | --- | --- |
| `POST` | `/usuarios` | Público | `nome`, `email`, `senha`, `papel` (`MORADOR` ou `ZELADOR`) |
| `GET` | `/usuarios` | Zelador | Nenhum |
| `POST` | `/autenticacao/entrar` | Público | `email`, `senha` |
| `GET` | `/usuarios/me` | Autenticado | Nenhum |
| `POST` | `/espacos` | Zelador | `nome`, `descricao`, `capacidade`, `regras` |
| `GET` | `/espacos` | Autenticado | Nenhum |
| `GET` | `/espacos/{espacoId}` | Autenticado | Nenhum |
| `PATCH` | `/espacos/{espacoId}` | Zelador | Ao menos um entre `nome`, `descricao`, `capacidade`, `regras` |
| `DELETE` | `/espacos/{espacoId}` | Zelador | Nenhum |
| `POST` | `/espacos/{espacoId}/reservas` | Morador | `data`, `horaInicio`, `horaFim` |
| `GET` | `/espacos/{espacoId}/reservas` | Autenticado | Query opcional: `data`, `dataInicio`, `dataFim`, `status`, `pagina`, `limite` |
| `GET` | `/espacos/{espacoId}/disponibilidade` | Autenticado | Query obrigatória: `data` |
| `GET` | `/reservas/minhas` | Autenticado | Query opcional: `data`, `dataInicio`, `dataFim`, `status`, `pagina`, `limite` |
| `GET` | `/reservas/pendentes` | Zelador | Nenhum |
| `PATCH` | `/reservas/{reservaId}/aprovacao` | Zelador | Nenhum |
| `PATCH` | `/reservas/{reservaId}/recusa` | Zelador | Nenhum |
| `POST` | `/reservas/{reservaId}/cancelamento` | Morador | Nenhum |
| `PATCH` | `/reservas/{reservaId}/cancelamento/aprovacao` | Zelador | Nenhum |
| `PATCH` | `/reservas/{reservaId}/cancelamento/recusa` | Zelador | Nenhum |

Exemplo de criação de espaço:

```json
{
  "nome": "Salão de festas",
  "descricao": "Espaço para eventos",
  "capacidade": 50,
  "regras": "Uso permitido até às 22h"
}
```

As listagens de reservas retornam `{ "itens": [], "pagina": 1, "limite": 20, "total": 0, "totalPaginas": 0 }`.
Os filtros `data`, `dataInicio` e `dataFim` usam `AAAA-MM-DD`; `status` aceita os status da reserva;
`pagina` começa em 1 e `limite` aceita valores de 1 a 100. A disponibilidade retorna somente reservas
`PENDENTE` ou `APROVADA` para a data informada.

Exemplo de resposta de sucesso (`201 Created`):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "Salão de festas",
  "descricao": "Espaço para eventos",
  "capacidade": 50,
  "regras": "Uso permitido até às 22h",
  "criadoEm": "2026-08-22T18:00:00.000Z"
}
```

Exemplos de erros esperados:

```json
{
  "erro": "SessaoNaoAutorizada",
  "mensagem": "Token ausente ou inválido"
}
```

Esse retorno usa `401 Unauthorized`. Um usuário autenticado, mas sem o papel necessário,
recebe `403 Forbidden`; dados inválidos geram `400 Bad Request`; recurso inexistente gera
`404 Not Found`; conflitos de regras de negócio geram `409 Conflict`; e falhas inesperadas
geram `500 Internal Server Error`.

## Arquitetura

O projeto segue Clean Architecture, no mesmo espírito do projeto de referência (Marmita-Solidária):

```
src/
  entities/            # Usuario, Espaco, Reserva — modelos de domínio e validações puras
  repositories/         # Interfaces de persistência (contratos)
  use-cases/             # Casos de uso e regras de negócio
    ports/               # Abstrações de infraestrutura (senha, id, tempo, token)
    errors/              # Erros de domínio, mapeados para status HTTP
    dtos/                # Formatos de entrada/saída dos casos de uso
  infrastructure/
    database/            # Implementações em memória dos repositórios
    services/             # Implementações concretas dos ports
    http/                 # Rotas Express, adaptador de controller, middlewares, Swagger
  interfaces/controllers/ # Controllers desacoplados do Express (implementam Controller)
  factories/             # configurarApi.ts monta o núcleo e injeta as dependências
  server.ts              # ponto de entrada
```

A regra principal: nada na camada de `use-cases` ou `entities` conhece o Express. Toda a
tradução HTTP fica isolada em `infrastructure/http` e `interfaces/controllers`.

## Autenticação (versão mínima)

Implementação propositalmente simples, mas já isolada atrás de uma interface (`ServicoToken`):
login retorna um token opaco guardado em memória, e um middleware Express (`MiddlewareAutenticacao`)
resolve esse token para o id do usuário autenticado antes de chegar nos controllers.

Quando quiser evoluir (JWT com expiração, refresh token, hash de senha mais robusto, etc.),
basta trocar as classes em `infrastructure/services/` — o resto do código não muda.

## Perfis e regras de negócio

- **Morador**: lista espaços, consulta calendário de disponibilidade, cria reservas, solicita
  cancelamento das próprias reservas.
- **Zelador**: tudo do morador, além de gerenciar espaços (criar/editar/remover) e
  aprovar/recusar reservas e solicitações de cancelamento.

Regras implementadas em `use-cases/AgendaReservas.ts`:

1. Reserva exige no mínimo 3h de antecedência.
2. Um morador não pode ter mais de uma reserva ativa (pendente ou aprovada) no mesmo dia.
3. Duas reservas ativas não podem se sobrepor no mesmo espaço.
4. Toda reserva nasce com status `PENDENTE`.
5. Cancelamento solicitado pelo morador entra como `CANCELAMENTO_SOLICITADO` e só vira
   `CANCELADA` com aprovação do zelador; se o zelador recusar, volta ao status anterior.

## Testando pelo Swagger

1. `POST /usuarios` — cadastre um usuário com `papel: "ZELADOR"` e outro com `"MORADOR"`.
2. `POST /autenticacao/entrar` — copie o `token` retornado.
3. No Swagger, clique em "Authorize" e cole o token (sem precisar do prefixo `Bearer`,
   o Swagger adiciona automaticamente).
4. Como zelador: `POST /espacos` para criar um espaço.
5. Como morador: `POST /espacos/{espacoId}/reservas` para reservar (use uma data/hora com
   pelo menos 3h de antecedência).
6. Como zelador: `PATCH /reservas/{reservaId}/aprovacao` para aprovar.

## Próximos passos sugeridos

- Trocar os repositórios em memória por Prisma + SQLite (só a pasta `infrastructure/database`
  muda; entidades e regras de negócio continuam iguais).
- Evoluir a autenticação para JWT com expiração.
- Construir o front-end React consumindo esta API.
