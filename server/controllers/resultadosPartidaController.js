const db = require("../database/connection");

// Registrar los resultados de una partida
const createResultadoPartida = async (req, res) => {
  const { partida_id, jugador_1_puntos, jugador_2_puntos, ganador_id } = req.body;

  try {
    // Verificar que la partida existe y el ganador es uno de los jugadores
    const [partida] = await db.promise().query("SELECT * FROM partidas WHERE id = ?", [partida_id]);
    const [ganador] = await db.promise().query("SELECT * FROM usuarios WHERE id = ?", [ganador_id]);

    if (partida.length === 0 || ganador.length === 0) {
      return res.status(400).json({ message: "Datos inválidos: partida o ganador no encontrados" });
    }

    // Insertar los resultados de la partida
    const query = `
      INSERT INTO resultados_partida (partida_id, jugador_1_puntos, jugador_2_puntos, ganador_id, fecha)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await db.promise().query(query, [partida_id, jugador_1_puntos, jugador_2_puntos, ganador_id]);

    return res.status(200).json({ message: "Resultado registrado correctamente", id: result.insertId });
  } catch (err) {
    console.error("Error al registrar el resultado de la partida:", err);
    return res.status(500).json({ message: "Error al registrar el resultado de la partida" });
  }
};

// Obtener los resultados de una partida
const getResultadoPartida = async (req, res) => {
  const { partida_id } = req.params;

  try {
    const [result] = await db.promise().query("SELECT * FROM resultados_partida WHERE partida_id = ?", [partida_id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Resultado no encontrado para esta partida" });
    }

    return res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error al obtener el resultado de la partida:", err);
    return res.status(500).json({ message: "Error al obtener el resultado de la partida" });
  }
};

module.exports = {
  createResultadoPartida,
  getResultadoPartida,
};
