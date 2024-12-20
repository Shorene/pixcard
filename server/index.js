const express = require("express");
const cors = require("cors");
const path = require("path");

const usuariosRoutes = require("./routes/usuarios");
const partidasRoutes = require("./routes/partidas");  // Aquí está la ruta correcta
const cartasRoutes = require("./routes/cartas");
const monedasRouter = require("./routes/monedas");
const usuariosCartasRoutes = require("./routes/usuariosCartas");
const mazosRoutes = require("./routes/mazos");
const resultadosPartidaRoutes = require("./routes/resultadosPartida");
const estadoPartidaRouter = require("./routes/estadoPartida");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Habilitar CORS para permitir solicitudes desde otros dominios
app.use(express.json()); // Para que Express pueda parsear los cuerpos JSON de las solicitudes

// Servir las imágenes desde la carpeta 'images' (si es necesario)
app.use("/images", express.static(path.join(__dirname, "images")));

// Rutas de la API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/partidas", partidasRoutes);  // Aquí está la ruta correcta
app.use("/api/cartas", cartasRoutes);
app.use("/api/monedas", monedasRouter);
app.use("/api/usuariosCartas", usuariosCartasRoutes);
app.use("/api/mazos", mazosRoutes);
app.use("/api/resultados_partida", resultadosPartidaRoutes);
app.use("/api/estado_partidas", estadoPartidaRouter);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto :${PORT}`);
});
