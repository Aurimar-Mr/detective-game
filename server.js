const express = require("express");
const cors = require("cors");
const path = require("path");
const cases = require("./data/cases");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Ruta principal — Render servirá tu index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Obtener todos los casos
app.get("/api/cases", (req, res) => {
  res.json(cases);
});

// ✅ Obtener un caso por ID
app.get("/api/cases/:id", (req, res) => {
  const caseId = parseInt(req.params.id);
  const gameCase = cases.find((c) => c.id === caseId);

  if (!gameCase) {
    return res.status(404).json({ message: "Caso no encontrado" });
  }
  res.json(gameCase);
});

// ✅ Verificar oración enviada por el jugador
app.post("/api/verify", (req, res) => {
  const { caseId, sentence } = req.body;

  if (!caseId || !sentence) {
    return res.status(400).json({ message: "Faltan datos en la solicitud" });
  }

  const gameCase = cases.find((c) => c.id === caseId);
  if (!gameCase) {
    return res.status(404).json({ message: "Caso no encontrado" });
  }

  const isCorrect =
    sentence.trim().toLowerCase() ===
    gameCase.correct_sentence.trim().toLowerCase();

  res.json({ correct: isCorrect });
});

// ✅ Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// ✅ Render usa su propio puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
