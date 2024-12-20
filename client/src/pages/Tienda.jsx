import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Tienda.css";
import genesis from "../images/expansion_genesis.jpeg";

const expansiones = [
  {
    id: 1,
    nombre: "Génesis",
    descripcion: "La primera expansión de Pixcard",
     imagen: genesis ,
  },
  // Aquí puedes agregar más expansiones en el futuro
];

const Tienda = () => {
  return (
    <div className="tienda-container">
      <h1 className="tienda-titulo">Tienda de Pixcard</h1>
      <p className="tienda-descripcion">Explora nuestras expansiones y consigue nuevas cartas para tu colección</p>
      
      <div className="expansiones-grid">
        {expansiones.map((expansion) => (
          <motion.div
            key={expansion.id}
            className="expansion-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={expansion.imagen} alt={expansion.nombre} className="expansion-imagen" />
            <h2 className="expansion-nombre">{expansion.nombre}</h2>
            <p className="expansion-descripcion">{expansion.descripcion}</p>
            <Link to={`/expansion/${expansion.id}`} className="btn-comprar">
              Comprar Sobres
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tienda;

  