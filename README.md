# 🏢 CondoReservas

Sistema web para gerenciamento de reservas de áreas comuns em condomínios residenciais.

---

## Sobre o Projeto

O **CondoReservas** permite que moradores reservem espaços compartilhados como churrasqueiras, salões de festa e quadras esportivas de forma prática, com validação automática de conflitos e controle pelo zelador.

---

## Perfis de Usuário

| Perfil | Descrição |
|---|---|
| **Morador** | Consulta espaços, visualiza calendário e realiza reservas |
| **Zelador (Admin)** | Aprova, recusa e cancela reservas; gerencia espaços e regras |

---

## Funcionalidades

- **Listagem de espaços** com descrição, capacidade e regras de uso de cada ambiente
- **Calendário de reservas** por espaço, com visualização de disponibilidade em tempo real
- **Realização de reservas** com validação automática de conflitos de horário
- **Aprovação e cancelamento** de reservas pelo zelador via painel administrativo

---

## Regras de Negócio

- Nenhum morador pode reservar mais de um espaço no mesmo dia (regra de convivência)
- Reservas conflitantes (mesmo espaço, mesma data/horário) são bloqueadas automaticamente
- Toda reserva fica pendente até aprovação do zelador

---

## Tecnologias

> A definir a stack.

Sugestões compatíveis com o escopo:

- **Frontend:** React ou Vue.js
- **Backend:** Node.js (Express) ou Python (FastAPI)
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT

---

## Estrutura Esperada do Projeto

```
condoreservas/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Espacos.jsx        # Listagem de áreas comuns
│   │   │   ├── Calendario.jsx     # Calendário de reservas
│   │   │   ├── MinhasReservas.jsx # Reservas do morador
│   │   │   └── Admin.jsx          # Painel do zelador
│   │   └── components/
├── backend/
│   ├── routes/
│   │   ├── reservas.py
│   │   ├── espacos.py
│   │   └── usuarios.py
│   └── models/
└── README.md
```

---

## Autor

**Daniel** — Projeto de disciplina / portfólio
