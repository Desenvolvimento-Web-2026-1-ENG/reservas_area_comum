<div align="center">

<img src="../assets/condoreservas-logo.png" alt="CondoReservas" width="180">

# Wireframes CondoReservas

**Documentacao visual da experiencia de reservas de areas comuns**

<br>

[Visao geral](#visao-geral) · [Fluxo](#fluxo-principal) · [Telas](#telas) · [Diretrizes](#diretrizes-de-layout)

</div>

---

## Visao geral

O CondoReservas organiza o ciclo completo de uso dos espacos compartilhados do condominio: o morador cria uma conta, consulta a disponibilidade, solicita reservas e acompanha seus pedidos. O zelador administra espacos, usuarios e decisoes pendentes.

Este documento apresenta o prototipo em ordem de navegacao, da tela **1** a **8**.

| Perfil | Responsabilidades principais |
| --- | --- |
| **Morador** | Consultar espacos, criar reservas, acompanhar status e solicitar cancelamentos |
| **Zelador** | Cadastrar espacos, consultar reservas, aprovar ou recusar pedidos e gerenciar usuarios |

## Fluxo principal

```mermaid
flowchart LR
	A[1. Entrar] --> B[2. Cadastro]
	B --> C[3. Espacos]
	C --> D[4. Detalhe do espaco]
	D --> E[5. Minhas reservas]
	E --> F[6. Aprovacoes]
	F --> G[7. Usuarios]
	G --> H[8. Perfil]
```

> As telas internas compartilham o mesmo cabecalho: marca, identificacao do prototipo, navegacao principal, controle de tags de endpoint e acao de saida.

## Telas

### 1. Entrar

Primeiro ponto de contato da aplicacao. Centraliza a autenticacao com e-mail e senha e oferece o caminho alternativo para criar uma conta.

**Elementos-chave**

- Cabecalho simplificado, sem navegacao interna.
- Formulario de acesso em cartao centralizado.
- Feedback de sucesso e falha associado a chamada de autenticacao.
- Link **Criar conta** direcionando para o cadastro.

![Tela 1 - Entrar](../assets/01-login.png)

---

### 2. Cadastro

Tela de criacao de usuario. Apresenta os campos essenciais e explicita que o papel pode ser **MORADOR** ou **ZELADOR**.

**Elementos-chave**

- Formulario vertical com nome, e-mail, senha e papel.
- Indicacoes de obrigatoriedade e regras de formato junto aos campos.
- Acao primaria **Cadastrar** destacada em laranja.
- Area livre a direita, mantendo o foco visual no formulario.

![Tela 2 - Cadastro](../assets/02-cadastro.png)

---

### 3. Espacos comuns

Catalogo de areas disponiveis para qualquer usuario autenticado. O layout divide a consulta dos espacos e a criacao restrita ao zelador.

**Elementos-chave**

- Lista ampla de espacos com nome, descricao, capacidade e regras.
- Acao **Abrir** em cada item para acessar os detalhes.
- Painel lateral de cadastro de espaco, visivel para o zelador.
- Separacao clara entre leitura e gerenciamento.

![Tela 3 - Espacos comuns](../assets/03-espacos.png)

---

### 4. Detalhe do espaco

Visao operacional de um espaco especifico. Reune informacoes, disponibilidade, calendario de reservas e formulario para uma nova solicitacao.

**Elementos-chave**

- Bloco de dados do espaco com capacidade e regras de uso.
- Acoes de edicao e remocao disponiveis ao zelador.
- Consulta de disponibilidade por data.
- Calendario filtravel com paginacao.
- Formulario de nova reserva com data, hora inicial e hora final.

![Tela 4 - Detalhe do espaco](../assets/04-espaco-detalhe.png)

---

### 5. Minhas reservas

Area do morador para acompanhar suas reservas e filtrar resultados por periodo, status e quantidade de itens.

**Elementos-chave**

- Barra de filtros em uma faixa horizontal.
- Lista de reservas com espaco, data, horario e status.
- Acao de cancelamento com tratamento visual de risco.
- Paginacao para listas maiores.

![Tela 5 - Minhas reservas](../assets/05-minhas-reservas.png)

---

### 6. Aprovacoes do zelador

Central de decisao do zelador. Separa reservas novas de solicitacoes de cancelamento para reduzir ambiguidades no fluxo administrativo.

**Elementos-chave**

- Secao **Reservas pendentes** com acoes **Aprovar** e **Recusar**.
- Secao **Cancelamentos solicitados** com acoes especificas para cada pedido.
- Status em etiquetas para leitura rapida.
- Acoes destrutivas representadas por contorno vermelho.

![Tela 6 - Aprovacoes do zelador](../assets/06-aprovacoes.png)

---

### 7. Usuarios

Lista administrativa de usuarios cadastrados, acessivel somente ao zelador. O foco e a comparacao rapida de dados em formato tabular.

**Elementos-chave**

- Tabela com nome, e-mail, papel e data de criacao.
- Etiquetas distinguem **MORADOR** e **ZELADOR**.
- Botao **Recarregar lista** para atualizar os dados.
- Mensagem de acesso negado prevista para moradores autenticados.

![Tela 7 - Usuarios](../assets/07-usuarios.png)

---

### 8. Perfil

Resumo da identidade do usuario autenticado e da sessao atual. Tambem concentra a acao de saida.

**Elementos-chave**

- Cartao de leitura com nome, e-mail, papel e data de criacao.
- Acao **Recarregar perfil** para atualizar os dados.
- Acao **Sair** com destaque de risco.
- Mensagem explicita de que o logout descarta o token no cliente.

![Tela 8 - Perfil](../assets/08-perfil.png)

## Diretrizes de layout

### Hierarquia visual

- Titulos de pagina grandes e alinhados ao conteudo principal.
- Subtitulos explicam o objetivo da tela em uma frase curta.
- Cartoes agrupam tarefas relacionadas sem competir com o conteudo.
- Tags monoespacadas representam endpoints, status e contratos da API.

### Cores e estados

| Uso | Tratamento visual |
| --- | --- |
| Acao primaria | Laranja solido com texto claro |
| Acao secundaria | Fundo claro e contorno neutro |
| Acao destrutiva | Contorno e texto vermelho |
| Status informativo | Etiqueta em tons claros de laranja |
| Endpoint | Tipografia monoespacada e fundo quente suave |

### Comportamento responsivo

Em larguras menores, os paineis lado a lado devem se empilhar verticalmente, os filtros devem quebrar em novas linhas e a tabela de usuarios deve permitir rolagem horizontal. A ordem e a prioridade das acoes devem permanecer iguais as apresentadas nos wireframes.

## Assets

Todas as imagens desta documentacao estao em [`docs/assets`](../assets/). Os nomes seguem a ordem da navegacao para facilitar atualizacoes e revisoes.
