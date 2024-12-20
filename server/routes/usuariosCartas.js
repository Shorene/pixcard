const express = require("express");
const router = express.Router();
const usuariosCartasController = require("../controllers/usuariosCartasController"); // Asegúrate de que la ruta sea correcta

// Rutas para el manejo de cartas de un usuario
router.get("/:idUsuario", usuariosCartasController.obtenerCartasUsuario); // Obtener todas las cartas de un usuario
router.get("/:idUsuario/carta/:idCarta", usuariosCartasController.obtenerCartaEspecifica); // Obtener una carta específica
router.post("/agregar", usuariosCartasController.agregarCartaUsuario); // Añadir o actualizar una carta
router.post("/eliminar", usuariosCartasController.eliminarCartaUsuario); // Eliminar una carta
// Ruta para comprar un sobre
router.post("/comprar-sobre", usuariosCartasController.comprarSobre);

module.exports = router;
