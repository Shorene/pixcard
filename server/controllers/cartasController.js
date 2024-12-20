const path = require("path");
const fs = require("fs");
const db = require("../database/connection");

// Crear una nueva carta
const createCarta = async (req, res) => {
  const { nombre, descripcion, tipo, nivel, ataque, defensa, tipo_carta } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Debe proporcionar una imagen para la carta" });
  }

  try {
    // Verificar si ya existe una carta con el mismo nombre
    const [existingCarta] = await db.promise().query("SELECT * FROM cartas WHERE nombre = ?", [nombre]);
    if (existingCarta.length > 0) {
      return res.status(400).json({ message: "Ya existe una carta con ese nombre" });
    }

    // Generar nombre único para la imagen
    const imagenNombre = `${Date.now()}_${req.file.originalname}`;
    const imagenRuta = path.join(__dirname, "../images/cartas", imagenNombre);

    // Guardar la imagen en la carpeta de cartas
    fs.writeFileSync(imagenRuta, req.file.buffer);

    // Insertar la carta en la base de datos
    const query = `
      INSERT INTO cartas (nombre, descripcion, tipo, nivel, ataque, defensa, tipo_carta, imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(query, [nombre, descripcion, tipo, nivel, ataque, defensa, tipo_carta, imagenNombre]);

    return res.status(200).json({ message: "Carta creada correctamente", id: result.insertId });
  } catch (err) {
    console.error("Error al crear la carta:", err);
    return res.status(500).json({ message: "Error al crear la carta" });
  }
};

// Obtener todas las cartas
const getCartas = async (req, res) => {
  try {
    const [result] = await db.promise().query("SELECT * FROM cartas");
    const cartasConImagenes = result.map(carta => ({
      ...carta,
      imagenUrl: `/images/cartas/${carta.imagen}` // Agregar la URL de la imagen
    }));
    return res.status(200).json(cartasConImagenes);
  } catch (err) {
    console.error("Error al obtener las cartas:", err);
    return res.status(500).json({ message: "Error al obtener las cartas" });
  }
};

// Obtener una carta por ID
const getCartaById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query("SELECT * FROM cartas WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Carta no encontrada" });
    }

    const carta = result[0];
    carta.imagenUrl = `/images/cartas/${carta.imagen}`; // Agregar la URL de la imagen

    return res.status(200).json(carta);
  } catch (err) {
    console.error("Error al obtener la carta:", err);
    return res.status(500).json({ message: "Error al obtener la carta" });
  }
};

// Actualizar una carta
const updateCarta = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo, nivel, ataque, defensa, tipo_carta } = req.body;

  let imagenNombre = null;
  if (req.file) {
    imagenNombre = `${Date.now()}_${req.file.originalname}`;
    const imagenRuta = path.join(__dirname, "../images/cartas", imagenNombre);
    fs.writeFileSync(imagenRuta, req.file.buffer); // Guardar la nueva imagen
  }

  try {
    const [existingCarta] = await db.promise().query("SELECT * FROM cartas WHERE id = ?", [id]);
    if (existingCarta.length === 0) {
      return res.status(404).json({ message: "Carta no encontrada" });
    }

    const query = `
      UPDATE cartas 
      SET nombre = ?, descripcion = ?, tipo = ?, nivel = ?, ataque = ?, defensa = ?, tipo_carta = ?, imagen = ?
      WHERE id = ?
    `;
    await db.promise().query(query, [
      nombre,
      descripcion,
      tipo,
      nivel,
      ataque,
      defensa,
      tipo_carta,
      imagenNombre || existingCarta[0].imagen,
      id
    ]);

    return res.status(200).json({ message: "Carta actualizada correctamente" });
  } catch (err) {
    console.error("Error al actualizar la carta:", err);
    return res.status(500).json({ message: "Error al actualizar la carta" });
  }
};

// Eliminar una carta
const deleteCarta = async (req, res) => {
  const { id } = req.params;

  try {
    const [existingCarta] = await db.promise().query("SELECT * FROM cartas WHERE id = ?", [id]);
    if (existingCarta.length === 0) {
      return res.status(404).json({ message: "Carta no encontrada" });
    }

    const query = "DELETE FROM cartas WHERE id = ?";
    await db.promise().query(query, [id]);

    // Eliminar la imagen de la carpeta
    const imagenRuta = path.join(__dirname, "../images/cartas", existingCarta[0].imagen);
    if (fs.existsSync(imagenRuta)) {
      fs.unlinkSync(imagenRuta); // Eliminar la imagen del sistema de archivos
    }

    return res.status(200).json({ message: "Carta eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar la carta:", err);
    return res.status(500).json({ message: "Error al eliminar la carta" });
  }
};

module.exports = {
  createCarta,
  getCartas,
  getCartaById,
  updateCarta,
  deleteCarta,
};
