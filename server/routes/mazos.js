const express = require('express');
const router = express.Router();
const mazosController = require('../controllers/mazosController');

// Crear un mazo
router.post('/', mazosController.crearMazo);

// Obtener todos los mazos de un usuario
router.get('/:usuario_id', mazosController.obtenerMazos);

// Agregar una carta a un mazo
router.post('/carta', mazosController.agregarCartaMazo);

// Eliminar una carta de un mazo
router.delete('/carta/:mazo_id/:carta_id', mazosController.eliminarCartaMazo);

// Obtener las cartas de un mazo
router.get('/mazos_cartas/:mazoId', mazosController.obtenerCartasPorMazo);

// Ruta para actualizar un mazo
router.put("/:mazo_id", mazosController.actualizarMazo);

module.exports = router;
