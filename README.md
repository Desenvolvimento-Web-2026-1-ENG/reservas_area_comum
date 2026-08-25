<div align="center">

<img src="docs/assets/condoreservas-logo.png" alt="CondoReservas" width="500">

### Sistema de gerenciamento e reservas para condomínios

</div>

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

## Regras de Negócio

- Nenhum morador pode reservar mais de um espaço no mesmo dia (regra de convivência)
- Reservas conflitantes (mesmo espaço, mesma data/horário) são bloqueadas automaticamente
- Toda reserva fica pendente até aprovação do zelador

---

## Tecnologias

> A definir a stack.

Sugestões compatíveis com o escopo:

- **Frontend:** React ou Vue.js
- **Backend:** Node.js (Express) 
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT

---


## Autor

**Daniel** — Projeto de disciplina / portfólio

---