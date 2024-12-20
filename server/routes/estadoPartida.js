const express = require("express");
const router = express.Router();
const estadoPartidaController = require("../controllers/estadoPartidaController");

// Obtener el estado de la partida
router.get("/:partida_id", estadoPartidaController.getEstadoPartida);

// Actualizar el estado de la partida
router.put("/:partida_id", estadoPartidaController.updateEstadoPartida);

module.exports = router;
