import { prisma } from "../src/infrastructure/database/prismaClient.js";

const senhaDemo =
  "41114a73346086ccb98d26d7f8333683:a4671a440418470d5aa553dc114b9bf2de62a9e0a4cb1eeebcc2a17378afe76cf6e64e6b5136e788968ad4787e22b9bfe39e3f0922eb9ced9988b6a931d8149b";

async function main() {
  await prisma.reserva.deleteMany();
  await prisma.espaco.deleteMany();
  await prisma.usuario.deleteMany();

  await prisma.usuario.createMany({
    data: [
      { id: "zelador-demo", nome: "Carlos Oliveira", email: "zelador@condominio.com", senhaCriptografada: senhaDemo, papel: "ZELADOR" },
      { id: "morador-demo", nome: "Ana Souza", email: "morador@condominio.com", senhaCriptografada: senhaDemo, papel: "MORADOR" }
    ]
  });

  await prisma.espaco.createMany({
    data: [
      { id: "salao-festas", nome: "Salão de Festas", descricao: "Espaço amplo para confraternizações, aniversários e eventos do condomínio.", capacidade: 60, regras: "Som até 22h. Entregar o espaço limpo após o uso." },
      { id: "churrasqueira", nome: "Churrasqueira", descricao: "Área externa equipada para pequenos encontros e churrascos.", capacidade: 20, regras: "Uso de carvão somente na churrasqueira. Recolher resíduos ao final." },
      { id: "salao-jogos", nome: "Salão de Jogos", descricao: "Ambiente para jogos e convivência dos moradores.", capacidade: 15, regras: "Respeitar o horário de silêncio e conservar os equipamentos." },
      { id: "quadra", nome: "Quadra Esportiva", descricao: "Quadra para futebol, vôlei e outras atividades esportivas.", capacidade: 20, regras: "Uso obrigatório de calçado adequado. Reservas de até 2 horas." }
    ]
  });

  console.log("Seed concluído.");
  console.log("Zelador: zelador@condominio.com / senha123");
  console.log("Morador: morador@condominio.com / senha123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
