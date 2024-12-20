// controllers/mazosController.js
const db = require("../database/connection"); // Importar la conexión a la base de datos

// Crear un mazo
const crearMazo = (req, res) => {
  const { nombre, usuario_id, cartas } = req.body;

  if (!nombre || !usuario_id) {
    return res.status(400).json({ error: "Nombre y usuario_id son obligatorios." });
  }

  const queryMazo = "INSERT INTO mazos (nombre, usuario_id) VALUES (?, ?)";

  db.query(queryMazo, [nombre, usuario_id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Error al crear el mazo" });
    }

    const mazoId = result.insertId;

    // Si no hay cartas, finalizar la operación aquí
    if (!cartas || cartas.length === 0) {
      return res.status(201).json({ message: "Mazo creado con éxito", mazoId });
    }

    // Insertar las cartas en la tabla mazos_cartas
    const queryCartas = "INSERT INTO mazos_cartas (mazo_id, carta_id, cantidad) VALUES ?";
    const valoresCartas = cartas.map((carta) => [mazoId, carta.carta_id, carta.cantidad]);

    db.query(queryCartas, [valoresCartas], (error) => {
      if (error) {
        return res.status(500).json({ error: "Error al agregar cartas al mazo" });
      }

      res.status(201).json({ message: "Mazo y cartas creados con éxito", mazoId });
    });
  });
};

// Obtener los mazos de un usuario
const obtenerMazos = (req, res) => {
  const { usuario_id } = req.params;

  const query = "SELECT * FROM mazos WHERE usuario_id = ?";
  db.query(query, [usuario_id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Error al obtener los mazos" });
    }

    res.status(200).json(result);
  });
};

// Agregar una carta a un mazo
const agregarCartaMazo = (req, res) => {
  const { mazo_id, carta_id, cantidad } = req.body;

  if (!mazo_id || !carta_id || !cantidad) {
    return res.status(400).json({ error: "Mazo ID, Carta ID y cantidad son obligatorios." });
  }

  const query = "INSERT INTO mazos_cartas (mazo_id, carta_id, cantidad) VALUES (?, ?, ?)";
  db.query(query, [mazo_id, carta_id, cantidad], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Error al agregar carta al mazo" });
    }

    res.status(201).json({ message: "Carta agregada al mazo con éxito" });
  });
};

// Eliminar una carta de un mazo
const eliminarCartaMazo = (req, res) => {
  const { mazo_id, carta_id } = req.params;

  const query = "DELETE FROM mazos_cartas WHERE mazo_id = ? AND carta_id = ?";
  db.query(query, [mazo_id, carta_id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Error al eliminar carta del mazo" });
    }

    res.status(200).json({ message: "Carta eliminada del mazo con éxito" });
  });
};

// Obtener cartas de un mazo específico
const obtenerCartasPorMazo = (req, res) => {
  const { mazoId } = req.params;

  console.log(`Recibida solicitud para mazoId: ${mazoId}`); // Agregar este log

  const query = `
    SELECT c.id, c.nombre, c.imagen, mc.cantidad 
    FROM mazos_cartas mc
    INNER JOIN cartas c ON mc.carta_id = c.id
    WHERE mc.mazo_id = ?`;

  db.query(query, [mazoId], (error, resultados) => {
    if (error) {
      console.error("Error al obtener las cartas del mazo:", error);
      return res.status(500).json({ error: "Error al obtener las cartas del mazo" });
    }

    console.log("Cartas encontradas:", resultados); // Agregar este log
    res.status(200).json(resultados);
  });
};

// Actualizar un mazo
const actualizarMazo = (req, res) => {
    const { mazo_id } = req.params;
    const { nombre, usuario_id, cartas } = req.body;
  
    if (!nombre || !usuario_id) {
      return res.status(400).json({ error: "Nombre y usuario_id son obligatorios." });
    }
  
    const queryMazo = "UPDATE mazos SET nombre = ?, usuario_id = ? WHERE id = ?";
    db.query(queryMazo, [nombre, usuario_id, mazo_id], (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Error al actualizar el mazo" });
      }
  
      // Si hay cartas, actualizar la tabla mazos_cartas
      if (cartas && cartas.length > 0) {
        // Eliminar las cartas existentes del mazo
        const queryEliminarCartas = "DELETE FROM mazos_cartas WHERE mazo_id = ?";
        db.query(queryEliminarCartas, [mazo_id], (error) => {
          if (error) {
            return res.status(500).json({ error: "Error al eliminar cartas del mazo" });
          }
  
          // Insertar las nuevas cartas
          const queryCartas = "INSERT INTO mazos_cartas (mazo_id, carta_id, cantidad) VALUES ?";
          const valoresCartas = cartas.map((carta) => [mazo_id, carta.carta_id, carta.cantidad]);
  
          db.query(queryCartas, [valoresCartas], (error) => {
            if (error) {
              return res.status(500).json({ error: "Error al agregar cartas al mazo" });
            }
  
            res.status(200).json({ message: "Mazo actualizado con éxito" });
          });
        });
      } else {
        res.status(200).json({ message: "Mazo actualizado con éxito" });
      }
    });
  };

module.exports = {
  crearMazo,
  obtenerMazos,
  agregarCartaMazo,
  eliminarCartaMazo,
  obtenerCartasPorMazo,
  actualizarMazo,
};
