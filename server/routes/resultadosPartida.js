const express = require("express");
const router = express.Router();
const resultadosPartidaController = require("../controllers/resultadosPartidaController");

// Registrar los resultados de una partida
router.post("/", resultadosPartidaController.createResultadoPartida);

// Obtener los resultados de una partida
router.get("/:partida_id", resultadosPartidaController.getResultadoPartida);

module.exports = router;
