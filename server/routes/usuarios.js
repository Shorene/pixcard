const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Rutas de usuarios
router.post("/check-usuario", usuariosController.checkUsuario); // Verificar si el usuario existe
router.post("/register", usuariosController.register); // Registrar un nuevo usuario
router.post("/login", usuariosController.login); // Iniciar sesión
router.post("/logout", usuariosController.logout); // Cerrar sesión
router.post("/heartbeat", usuariosController.heartbeat); // Actualizar última actividad

// Ruta para obtener usuarios conectados
router.get("/usuarios-conectados", usuariosController.getUsuariosConectados);

// Nueva ruta para obtener todos los usuarios
router.get("/todos", usuariosController.getAllUsuarios);
module.exports = router;
