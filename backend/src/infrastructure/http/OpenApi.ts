import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function configurarDocumentacao(app: Express) {
  const caminho = path.resolve(__dirname, "../../../openapi.json");
  const documento = JSON.parse(readFileSync(caminho, "utf-8"));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(documento));
  app.get("/openapi.json", (_req, res) => res.json(documento));
}
