const express = require("express");
const cors = require("cors");
const cases = require("./data/cases");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Obtener todos los casos
app.get("/api/cases", (req, res) => {
  res.json(cases);
});

// Obtener caso por ID
app.get("/api/cases/:id", (req, res) => {
  const caseId = parseInt(req.params.id);
  const gameCase = cases.find(c => c.id === caseId);

  if (!gameCase) {
    return res.status(404).json({ message: "Caso no encontrado" });
  }
  res.json(gameCase);
});

// Verificar oración
app.post("/api/verify", (req, res) => {
  const { caseId, sentence } = req.body;
  const gameCase = cases.find(c => c.id === caseId);

  if (!gameCase) {
    return res.status(404).json({ message: "Caso no encontrado" });
  }

  const isCorrect = sentence.trim().toLowerCase() === gameCase.correct_sentence.trim().toLowerCase();
  res.json({ correct: isCorrect });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
