const db = require("../database/connection");

// Crear una nueva partida
const crearPartida = async (req, res) => {
  const { jugador_id } = req.body;

  try {
    // Verificar si el jugador ya tiene una partida activa
    const [partidaExistente] = await db.promise().query(
      "SELECT * FROM partidas WHERE (jugador_1_id = ? OR jugador_2_id = ?) AND estado IN ('esperando', 'en progreso')",
      [jugador_id, jugador_id]
    );

    if (partidaExistente.length > 0) {
      return res.status(400).json({ message: "Ya estás participando en una partida activa." });
    }

    // Crear una nueva partida
    const fechaInicio = new Date();
    const query = "INSERT INTO partidas (jugador_1_id, estado, fecha_inicio) VALUES (?, ?, ?)";
    const [result] = await db.promise().query(query, [jugador_id, 'esperando', fechaInicio]);

    return res.status(201).json({ message: "Partida creada", partidaId: result.insertId });
  } catch (err) {
    console.error("Error al crear partida:", err);
    return res.status(500).json({ message: "Error al crear partida" });
  }
};




// Obtener una partida disponible
const obtenerPartidaEsperando = async (req, res) => {
  try {
    const [result] = await db.promise().query("SELECT * FROM partidas WHERE estado = 'esperando' LIMIT 1");
    if (result.length === 0) {
      return res.status(404).json({ message: "No hay partidas esperando" });
    }
    return res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error al obtener partida:", err);
    return res.status(500).json({ message: "Error al obtener partida" });
  }
};


// Unir un jugador a una partida
const unirAPartida = async (req, res) => {
  const { partida_id, jugador_2_id } = req.body;

  try {
    // Verificar si el jugador ya está en la partida
    const [partida] = await db.promise().query("SELECT * FROM partidas WHERE id = ?", [partida_id]);

    if (partida.length === 0) {
      return res.status(404).json({ message: "La partida no existe." });
    }

    const { jugador_1_id, jugador_2_id: jugadorExistente } = partida[0];

    if (jugador_1_id === jugador_2_id || jugadorExistente === jugador_2_id) {
      return res.status(400).json({ message: "Ya estás registrado en esta partida." });
    }

    // Unir al jugador como jugador_2
    const query = "UPDATE partidas SET jugador_2_id = ?, estado = 'en progreso' WHERE id = ?";
    await db.promise().query(query, [jugador_2_id, partida_id]);

    return res.status(200).json({ message: "Jugador unido a la partida" });
  } catch (err) {
    console.error("Error al unir jugador a la partida:", err);
    return res.status(500).json({ message: "Error al unir jugador a la partida" });
  }
};

const rendirse = async (req, res) => {
  const { partida_id, jugador_id } = req.body;

  console.log("Parámetros recibidos:", partida_id, jugador_id); // Para depuración

  try {
    // Buscar la partida en la base de datos
    const [partida] = await db.promise().query("SELECT * FROM partidas WHERE id = ?", [partida_id]);

    if (partida.length === 0) {
      console.error("Partida no encontrada.");
      return res.status(404).json({ message: "La partida no existe." });
    }

    const { jugador_1_id, jugador_2_id } = partida[0];

    // Verificar si el jugador está en la partida
    let ganador_id = null;
    if (jugador_id === jugador_1_id) {
      ganador_id = jugador_2_id;
    } else if (jugador_id === jugador_2_id) {
      ganador_id = jugador_1_id;
    } else {
      console.error("El jugador no pertenece a la partida.");
      return res.status(400).json({ message: "El jugador no pertenece a esta partida." });
    }

    // Finalizar la partida y actualizar el estado en la base de datos
    const fechaFin = new Date();
    const query = "UPDATE partidas SET estado = 'finalizado', fecha_fin = ?, ganador_id = ? WHERE id = ?";
    const [result] = await db.promise().query(query, [fechaFin, ganador_id, partida_id]);

    if (result.affectedRows === 0) {
      console.error("Error al actualizar la partida.");
      return res.status(500).json({ message: "Error al finalizar la partida." });
    }

    // Responder con los IDs de los jugadores y el ganador
    return res.status(200).json({ 
      message: "El jugador se rindió. La partida ha finalizado.", 
      ganador_id, 
      jugadores: [jugador_1_id, jugador_2_id] // Enviamos ambos jugadores para redirigirlos
    });
  } catch (err) {
    console.error("Error al procesar la rendición:", err);
    return res.status(500).json({ message: "Error al procesar la rendición." });
  }
};


// Obtener una partida por ID
const obtenerPartidaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [partida] = await db.promise().query("SELECT * FROM partidas WHERE id = ?", [id]);

    if (partida.length === 0) {
      return res.status(404).json({ message: "La partida no existe." });
    }

    return res.status(200).json(partida[0]);
  } catch (err) {
    console.error("Error al obtener la partida:", err);
    return res.status(500).json({ message: "Error al obtener la partida." });
  }
};

module.exports = {
  crearPartida,
  obtenerPartidaEsperando,
  unirAPartida,
  rendirse,
  obtenerPartidaPorId,
};
