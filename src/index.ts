import express from "express";
import { Client } from "pg";

const app = express();
app.use(express.json());

const db = new Client({
  host: "db",
  user: "admin",
  password: "@dmin.Teste",
  database: "vidaplus_db",
  port: 5432,
});

db.connect()
  .then(() => console.log("Conectado ao Postgres com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao banco:", err));

app.get("/", (req, res) => {
  res.send("SGHSS VidaPlus - Back-end Online!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
