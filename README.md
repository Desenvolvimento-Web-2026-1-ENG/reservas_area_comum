<div align="center">

<img src="docs/assets/condoreservas-logo.png" alt="CondoReservas" width="500">

### Sistema de gerenciamento e reservas para areas comuns de condominios

</div>

---

## Overview

O **CondoReservas** é uma aplicacao para organizar o uso de areas comuns em condominios residenciais. A proposta e permitir que moradores consultem espacos, verifiquem horarios e solicitem reservas, enquanto o zelador acompanha e administra as decisoes do condominio.

Neste momento, o projeto possui o **backend funcional**, com as regras de negocio, autenticacao, controle de acesso e endpoints da API implementados. A proxima etapa e introduzir o frontend para transformar esses fluxos em uma experiencia completa de uso no navegador.

## Estado atual

### Backend disponivel

- Cadastro e autenticacao de usuarios.
- Perfis de **MORADOR** e **ZELADOR**.
- Cadastro, consulta, edicao e remocao de espacos pelo zelador.
- Consulta de disponibilidade e calendario de reservas.
- Criacao de reservas por moradores.
- Aprovacao e recusa de reservas pelo zelador.
- Solicitacao e tratamento de cancelamentos.
- Validacao de conflitos e regras de convivencia.
- Persistencia temporaria em memoria durante a execucao do servidor.

### Proxima etapa

Introduzir o frontend e conecta-lo a API existente, cobrindo os fluxos de login, cadastro, consulta de espacos, criacao de reservas, acompanhamento de pedidos e operacao do zelador. O layout inicial dessas telas esta documentado em [docs/wireframe/wireframe.md](docs/wireframe/wireframe.md).

## Perfis de usuario

| Perfil | O que pode fazer |
| --- | --- |
| **Morador** | Consultar espacos e disponibilidade, criar reservas e solicitar cancelamento das proprias reservas |
| **Zelador** | Gerenciar espacos, consultar usuarios, aprovar ou recusar reservas e tratar solicitacoes de cancelamento |

## Regras de negocio

- A reserva exige no minimo 3 horas de antecedencia.
- Um morador nao pode ter mais de uma reserva ativa no mesmo dia.
- Reservas ativas nao podem se sobrepor no mesmo espaco.
- Toda nova reserva inicia com status `PENDENTE`.
- O cancelamento solicitado pelo morador depende da decisao do zelador.

## Como executar o backend

```bash
cd backend
npm install
npm run dev
```

Com o servidor em execucao, a API fica disponivel em `http://localhost:3001`.

## Documentacao da API

A documentacao detalhada da API esta no README dentro da pasta `backend`:

**[Abrir README do backend](backend/README.md)**

Esse documento apresenta:

- Como executar o servidor.
- Endpoints, parametros, corpos de requisicao e respostas.
- Regras de autenticacao com token Bearer.
- Codigos de erro esperados.
- Organizacao interna do backend.
- Passo a passo para testar a API pelo Swagger.

Com o backend rodando, tambem e possivel acessar:

- **Swagger:** `http://localhost:3001/api/docs`
- **OpenAPI:** `http://localhost:3001/openapi.json`

## Estrutura atual

```
reservas_area_comum/
├── backend/
│   ├── src/
│   │   ├── entities/          # Entidades e validacoes do dominio
│   │   ├── use-cases/         # Regras e operacoes da aplicacao
│   │   ├── repositories/      # Contratos dos repositorios
│   │   ├── interfaces/        # Controllers
│   │   ├── infrastructure/    # HTTP, memoria e servicos
│   │   └── factories/         # Montagem da aplicacao
│   ├── openapi.json           # Especificacao da API
│   └── README.md              # Documentacao detalhada do backend
├── docs/
│   ├── assets/                # Imagens das telas
│   └── wireframe/             # Documentacao do layout
└── README.md                 # Visao geral do projeto
```

## Links rapidos

- [Documentacao do backend](backend/README.md)
- [Documentacao dos wireframes](docs/wireframe/wireframe.md)
- [Especificacao OpenAPI](backend/openapi.json)
