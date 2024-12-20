const bcrypt = require("bcryptjs");
const db = require("../database/connection");  // Trae la conexión con promesas

// Verificar si el nombre de usuario ya está en uso
const checkUsuario = async (req, res) => {
  const { usuario } = req.body;

  try {
    const [result] = await db.promise().query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);
    if (result.length > 0) {
      return res.status(400).send("El nombre de usuario ya está en uso");
    }
    return res.status(200).send("El nombre de usuario está disponible");
  } catch (err) {
    console.error("Error al verificar el usuario:", err);
    return res.status(500).send("Error al verificar el usuario");
  }
};

// Registro de usuario
const register = async (req, res) => {
  const { usuario, correo, contrasenia } = req.body;

  try {
    const [result] = await db.promise().query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
    if (result.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const fechaRegistro = new Date().toISOString().slice(0, 19).replace("T", " ");
    const estado = "activo";
    const avatar = null;

    const insertQuery = `
      INSERT INTO usuarios (usuario, correo, contrasenia, fecha_registro, estado, avatar, ultima_actividad)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.promise().query(insertQuery, [usuario, correo, hashedPassword, fechaRegistro, estado, avatar, fechaRegistro]);

    return res.status(200).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar el usuario:", err);
    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// Login de usuario
const login = async (req, res) => {
  const { usuario, contrasenia } = req.body;

  try {
    const [result] = await db.promise().query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);
    if (result.length === 0) {
      return res.status(400).json({ message: "Nombre de usuario o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(contrasenia, result[0].contrasenia);
    if (isMatch) {
      const ultimaActividad = new Date().toISOString().slice(0, 19).replace("T", " ");
      const updateQuery = "UPDATE usuarios SET estado = 'activo', ultima_actividad = ? WHERE id = ?";
      await db.promise().query(updateQuery, [ultimaActividad, result[0].id]);

      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        id: result[0].id, // Incluye el ID del usuario
        usuario: result[0].usuario,
        correo: result[0].correo,
      });
    }
    return res.status(400).json({ message: "Nombre de usuario o contraseña incorrectos" });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// Logout de usuario
const logout = async (req, res) => {
  const { id } = req.body;

  try {
    const logoutQuery = "UPDATE usuarios SET estado = 'desconectado' WHERE id = ?";
    await db.promise().query(logoutQuery, [id]);
    res.status(200).send("Usuario desconectado");
  } catch (err) {
    console.error("Error al desconectar al usuario:", err);
    return res.status(500).send("Error al desconectar al usuario");
  }
};

// Actualizar última actividad (heartbeat)
const heartbeat = async (req, res) => {
  const { id } = req.body;
  try {
    const heartbeatQuery = "UPDATE usuarios SET ultima_actividad = NOW() WHERE id = ?";
    await db.promise().query(heartbeatQuery, [id]);
    res.status(200).send("Última actividad actualizada");
  } catch (err) {
    console.error("Error al actualizar última actividad:", err);
    return res.status(500).send("Error al actualizar última actividad");
  }
};


// Obtener usuarios conectados
const getUsuariosConectados = async (req, res) => {
  const inactividadLimite = "1 MINUTE";

  try {
    // Desconectar usuarios inactivos
    const desconectarInactivosQuery = `
      UPDATE usuarios
      SET estado = 'desconectado'
      WHERE ultima_actividad < (NOW() - INTERVAL ${inactividadLimite}) AND estado = 'activo'
    `;
    await db.promise().query(desconectarInactivosQuery);

    // Obtener usuarios activos
    const queryConectados = "SELECT id, usuario, estado, correo, avatar FROM usuarios WHERE estado = 'activo'";
    const [result] = await db.promise().query(queryConectados);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error al obtener usuarios conectados:", err);
    return res.status(500).send("Error al obtener usuarios conectados");
  }
};

// Obtener todos los usuarios (independientemente de su estado)
const getAllUsuarios = async (req, res) => {
  try {
    const queryTodosUsuarios = "SELECT id, usuario, estado, correo, avatar FROM usuarios";
    const [result] = await db.promise().query(queryTodosUsuarios);

    res.status(200).json(result); // Enviamos la lista completa de usuarios
  } catch (err) {
    console.error("Error al obtener todos los usuarios:", err);
    return res.status(500).send("Error al obtener todos los usuarios");
  }
};

// Exportar funciones
module.exports = {
  checkUsuario,
  register,
  login,
  logout,
  heartbeat,
  getUsuariosConectados,
  getAllUsuarios, // Exportamos el nuevo método
};
