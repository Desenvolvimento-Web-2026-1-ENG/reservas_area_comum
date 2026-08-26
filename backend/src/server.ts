import { configurarApi } from "./factories/configurarApi.js";

const PORTA = process.env.PORTA ? Number(process.env.PORTA) : 3001;

const app = configurarApi();

app.listen(PORTA, () => {
  console.log(`CondoReservas backend rodando em http://localhost:${PORTA}`);
  console.log(`Documentação Swagger em http://localhost:${PORTA}/api/docs`);
});
