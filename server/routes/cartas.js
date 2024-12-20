const express = require("express");
const router = express.Router();
const multer = require("multer");
const cartasController = require("../controllers/cartasController");

// Configuración de Multer para manejar la subida de imágenes en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rutas para manejar las cartas

// Crear una nueva carta (requiere imagen)
router.post("/", upload.single("imagen"), cartasController.createCarta);

// Obtener todas las cartas
router.get("/", cartasController.getCartas);

// Obtener una carta específica por ID
router.get("/:id", cartasController.getCartaById);

// Actualizar una carta (opcionalmente puede incluir una nueva imagen)
router.put("/:id", upload.single("imagen"), cartasController.updateCarta);

// Eliminar una carta por ID
router.delete("/:id", cartasController.deleteCarta);

module.exports = router;
