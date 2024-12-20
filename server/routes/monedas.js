const express = require("express");
const router = express.Router();
const monedasController = require("../controllers/monedasController");

// Rutas para gestionar monedas

// Obtener todas las monedas
router.get("/", monedasController.getAllMonedas);

// Obtener las monedas de un usuario específico agrupadas por tipo
router.get("/:id_usuario", monedasController.getMonedasByUsuario);

// Rutas separadas para actualizar monedas específicas (oro y minicoins)
router.put("/:id_usuario/oro", monedasController.updateOro);  // Actualizar oro
router.put("/:id_usuario/minicoins", monedasController.updateMinicoins);  // Actualizar minicoins

// Crear una nueva entrada de monedas
router.post("/", monedasController.createMonedas);

// Eliminar una entrada de monedas por ID
router.delete("/:id_moneda", monedasController.deleteMonedas);

module.exports = router;
