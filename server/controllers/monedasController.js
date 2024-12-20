const db = require("../database/connection");

// Obtener todas las monedas
const getAllMonedas = async (req, res) => {
  try {
    const [result] = await db.promise().query("SELECT * FROM monedas");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener las monedas:", error);
    res.status(500).json({ message: "Error al obtener las monedas." });
  }
};

// Obtener las monedas de un usuario específico agrupadas por tipo
const getMonedasByUsuario = async (req, res) => {
    const { id_usuario } = req.params;
  
    try {
      const [result] = await db.promise().query(
        "SELECT tipo_moneda, SUM(cantidad) AS total FROM monedas WHERE id_usuario = ? GROUP BY tipo_moneda",
        [id_usuario]
      );
  
      // Crear un objeto con las monedas
      const monedas = {
        oro: 0,
        minicoins: 0,
      };
  
      // Asignar valores a las monedas dependiendo de la respuesta
      result.forEach((row) => {
        if (row.tipo_moneda === "oro") {
          monedas.oro = row.total;
        } else if (row.tipo_moneda === "minicoins") {
          monedas.minicoins = row.total;
        }
      });
  
      res.status(200).json(monedas); // Devolver el objeto con oro y minicoins
    } catch (error) {
      console.error("Error al obtener las monedas del usuario:", error);
      res.status(500).json({ message: "Error al obtener las monedas del usuario." });
    }
  };

// Actualizar la cantidad de oro para un usuario
const updateOro = async (req, res) => {
  const { id_usuario } = req.params;
  const { cantidad } = req.body;

  try {
    // Verificar si el usuario y el tipo de moneda "oro" existen
    const [checkExistence] = await db.promise().query(
      "SELECT * FROM monedas WHERE id_usuario = ? AND tipo_moneda = 'oro'",
      [id_usuario]
    );

    if (checkExistence.length === 0) {
      return res.status(404).json({ message: "No se encontró la moneda de tipo 'oro' para actualizar." });
    }

    // Actualizar la cantidad de oro
    const [result] = await db.promise().query(
      "UPDATE monedas SET cantidad = ? WHERE id_usuario = ? AND tipo_moneda = 'oro'",
      [cantidad, id_usuario]
    );

    res.status(200).json({ message: "Oro actualizado con éxito.", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Error al actualizar el oro:", error);
    res.status(500).json({ message: "Error al actualizar el oro." });
  }
};

// Actualizar la cantidad de minicoins para un usuario
const updateMinicoins = async (req, res) => {
  const { id_usuario } = req.params;
  const { cantidad } = req.body;

  try {
    // Verificar si el usuario y el tipo de moneda "minicoins" existen
    const [checkExistence] = await db.promise().query(
      "SELECT * FROM monedas WHERE id_usuario = ? AND tipo_moneda = 'minicoins'",
      [id_usuario]
    );

    if (checkExistence.length === 0) {
      return res.status(404).json({ message: "No se encontró la moneda de tipo 'minicoins' para actualizar." });
    }

    // Actualizar la cantidad de minicoins
    const [result] = await db.promise().query(
      "UPDATE monedas SET cantidad = ? WHERE id_usuario = ? AND tipo_moneda = 'minicoins'",
      [cantidad, id_usuario]
    );

    res.status(200).json({ message: "Minicoins actualizados con éxito.", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Error al actualizar los minicoins:", error);
    res.status(500).json({ message: "Error al actualizar los minicoins." });
  }
};

// Crear una nueva entrada de monedas (oro o minicoins)
const createMonedas = async (req, res) => {
    const { id_usuario, tipo_moneda, cantidad } = req.body;
  
    try {
      const [result] = await db.promise().query(
        "INSERT INTO monedas (id_usuario, tipo_moneda, cantidad) VALUES (?, ?, ?)",
        [id_usuario, tipo_moneda, cantidad]
      );
  
      res.status(201).json({ message: "Monedas creadas con éxito.", id: result.insertId });
    } catch (error) {
      console.error("Error al crear las monedas:", error);
      res.status(500).json({ message: "Error al crear las monedas." });
    }
  };

// Eliminar una entrada de monedas
const deleteMonedas = async (req, res) => {
  const { id_moneda } = req.params;

  try {
    const [result] = await db.promise().query("DELETE FROM monedas WHERE id_moneda = ?", [id_moneda]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró la entrada de monedas para eliminar." });
    }

    res.status(200).json({ message: "Monedas eliminadas con éxito.", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Error al eliminar las monedas:", error);
    res.status(500).json({ message: "Error al eliminar las monedas." });
  }
};

module.exports = {
  getAllMonedas,
  getMonedasByUsuario,
  updateOro,
  updateMinicoins,
  createMonedas,
  deleteMonedas,
};
