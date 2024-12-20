const db = require("../database/connection");

// Obtener el estado actual de una partida
const getEstadoPartida = async (req, res) => {
  const { partida_id } = req.params;

  try {
    const [result] = await db.promise().query("SELECT * FROM estado_partida WHERE partida_id = ?", [partida_id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Estado de la partida no encontrado" });
    }

    return res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error al obtener el estado de la partida:", err);
    return res.status(500).json({ message: "Error al obtener el estado de la partida" });
  }
};

// Actualizar el estado de la partida
const updateEstadoPartida = async (req, res) => {
  const { partida_id } = req.params;
  const { turno, jugador_actual_id, estado_partida } = req.body;

  try {
    const [existingEstado] = await db.promise().query("SELECT * FROM estado_partida WHERE partida_id = ?", [partida_id]);
    if (existingEstado.length === 0) {
      return res.status(404).json({ message: "Estado de la partida no encontrado" });
    }

    const query = `
      UPDATE estado_partida 
      SET turno = ?, jugador_actual_id = ?, estado_partida = ?
      WHERE partida_id = ?
    `;
    await db.promise().query(query, [turno, jugador_actual_id, estado_partida, partida_id]);

    return res.status(200).json({ message: "Estado de la partida actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar el estado de la partida:", err);
    return res.status(500).json({ message: "Error al actualizar el estado de la partida" });
  }
};

module.exports = {
  getEstadoPartida,
  updateEstadoPartida,
};
