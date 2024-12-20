const express = require("express");
const router = express.Router();
const partidasController = require("../controllers/partidasController");

// Crear una nueva partida
router.post("/", partidasController.crearPartida);

// Obtener una partida disponible
router.get("/esperando", partidasController.obtenerPartidaEsperando);

// Unir un jugador a una partida
router.put("/unir", partidasController.unirAPartida);

// Manejar rendición de un jugador
router.put("/rendirse", partidasController.rendirse);

// Obtener una partida por ID
router.get("/:id", partidasController.obtenerPartidaPorId);



module.exports = router;
