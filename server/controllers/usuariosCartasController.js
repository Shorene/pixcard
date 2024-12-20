const db = require("../database/connection");

// Obtener todas las cartas de un usuario
const obtenerCartasUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const [cartas] = await db.promise().query(
      `SELECT cartas.*, usuarios_cartas.cantidad
      FROM usuarios_cartas 
      JOIN cartas ON usuarios_cartas.id_carta = cartas.id
      WHERE usuarios_cartas.id_usuario = ?`,
      [idUsuario]
    );

    return res.status(200).json(cartas);
  } catch (err) {
    console.error("Error al obtener las cartas del usuario:", err);
    return res.status(500).json({ message: "Error al obtener las cartas" });
  }
};

// Obtener una carta específica de un usuario
const obtenerCartaEspecifica = async (req, res) => {
  const { idUsuario, idCarta } = req.params;

  try {
    const [result] = await db.promise().query(
      "SELECT cantidad FROM usuarios_cartas WHERE id_usuario = ? AND id_carta = ?",
      [idUsuario, idCarta]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Carta no encontrada" });
    }

    return res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error al obtener la carta específica:", err);
    return res.status(500).json({ message: "Error al obtener la carta específica" });
  }
};

// Añadir o actualizar una carta en el inventario de un usuario
const agregarCartaUsuario = async (req, res) => {
  const { idUsuario, idCarta } = req.body;

  try {
    // Verificar si ya tiene la carta
    const [registroExistente] = await db.promise().query(
      "SELECT cantidad FROM usuarios_cartas WHERE id_usuario = ? AND id_carta = ?",
      [idUsuario, idCarta]
    );

    if (registroExistente.length > 0) {
      // Si ya tiene la carta, incrementa la cantidad
      await db.promise().query(
        "UPDATE usuarios_cartas SET cantidad = cantidad + 1 WHERE id_usuario = ? AND id_carta = ?",
        [idUsuario, idCarta]
      );
    } else {
      // Si no la tiene, inserta una nueva fila
      await db.promise().query(
        "INSERT INTO usuarios_cartas (id_usuario, id_carta, cantidad) VALUES (?, ?, ?)",
        [idUsuario, idCarta, 1]
      );
    }

    return res.status(200).json({ message: "Carta añadida correctamente" });
  } catch (err) {
    console.error("Error al añadir la carta al usuario:", err);
    return res.status(500).json({ message: "Error al añadir la carta al usuario" });
  }
};

// Eliminar una carta del inventario de un usuario
const eliminarCartaUsuario = async (req, res) => {
  const { idUsuario, idCarta } = req.body;

  try {
    const [registroExistente] = await db.promise().query(
      "SELECT cantidad FROM usuarios_cartas WHERE id_usuario = ? AND id_carta = ?",
      [idUsuario, idCarta]
    );

    if (registroExistente.length === 0) {
      return res.status(404).json({ message: "Carta no encontrada" });
    }

    // Si tiene más de una carta, decrementa la cantidad
    if (registroExistente[0].cantidad > 1) {
      await db.promise().query(
        "UPDATE usuarios_cartas SET cantidad = cantidad - 1 WHERE id_usuario = ? AND id_carta = ?",
        [idUsuario, idCarta]
      );
    } else {
      // Si solo tiene una, elimina la carta
      await db.promise().query(
        "DELETE FROM usuarios_cartas WHERE id_usuario = ? AND id_carta = ?",
        [idUsuario, idCarta]
      );
    }

    return res.status(200).json({ message: "Carta eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar la carta del usuario:", err);
    return res.status(500).json({ message: "Error al eliminar la carta" });
  }
};

// Función para comprar un sobre
const comprarSobre = async (req, res) => {
  const { idUsuario } = req.body;  // El ID del usuario que lo está comprando

  try {
    // Verificar si el usuario tiene suficiente oro
    const [moneda] = await db.promise().query(
      "SELECT cantidad FROM monedas WHERE id_usuario = ? AND tipo_moneda = 'oro'",
      [idUsuario]
    );

    if (moneda.length === 0 || moneda[0].cantidad < 500) {
      return res.status(400).json({ message: "No tienes suficiente oro para comprar el sobre." });
    }

    // Restar el oro del usuario (500 oro)
    await db.promise().query(
      "UPDATE monedas SET cantidad = cantidad - 500 WHERE id_usuario = ? AND tipo_moneda = 'oro'",
      [idUsuario]
    );

    // Obtener 3 cartas aleatorias
    const [cartas] = await db.promise().query("SELECT * FROM cartas ORDER BY RAND() LIMIT 3");

    // Añadir o actualizar las cartas en el inventario del usuario
    for (let carta of cartas) {
      // Verificar si la carta ya existe en el inventario del usuario
      const [registroExistente] = await db.promise().query(
        "SELECT cantidad FROM usuarios_cartas WHERE id_usuario = ? AND id_carta = ?",
        [idUsuario, carta.id]
      );

      if (registroExistente.length > 0) {
        // Si la carta ya existe, incrementar la cantidad
        await db.promise().query(
          "UPDATE usuarios_cartas SET cantidad = cantidad + 1 WHERE id_usuario = ? AND id_carta = ?",
          [idUsuario, carta.id]
        );
      } else {
        // Si no la tiene, insertar una nueva fila con cantidad 1
        await db.promise().query(
          "INSERT INTO usuarios_cartas (id_usuario, id_carta, cantidad) VALUES (?, ?, ?)",
          [idUsuario, carta.id, 1]
        );
      }
    }

    return res.status(200).json({ message: "Sobre comprado con éxito", cartas });
  } catch (err) {
    console.error("Error al comprar el sobre:", err);
    return res.status(500).json({ message: "Hubo un problema al comprar el sobre." });
  }
};


module.exports = {
  obtenerCartasUsuario,
  obtenerCartaEspecifica,
  agregarCartaUsuario,
  eliminarCartaUsuario,
  comprarSobre,
};
