import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ruta de prueba
app.get("/", (req, res) => {
  res.send("💜 LoveApp backend activo");
});

export default app;