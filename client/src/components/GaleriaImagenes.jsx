import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Axios from 'axios';

const GaleriaImagenes = () => {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    // Llama al servidor para obtener las imágenes
    Axios.get('http://localhost:3001/api/cartas')
      .then((response) => {
        // Mapea los datos para tener un array con src y alt
        const data = response.data.map((carta) => ({
          src: `http://localhost:3001${carta.imagenUrl}`, // Combina la URL base con el campo imagenUrl
          alt: carta.nombre, // Usa el nombre de la carta como alt
        }));
        setImagenes(data); // Actualiza el estado con las imágenes
      })
      .catch((error) => {
        console.error('Error al cargar las imágenes:', error);
      });
  }, []);

  return (
    <section className="galeria-imagenes my-5">
      <h2 className="text-center mb-4" style={{ color: 'yellow' }}>Galería de Cartas</h2>
      <div className="row">
        {imagenes.map((imagen, index) => (
          <motion.div
            key={index}
            className="col-md-3 col-sm-6 mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={imagen.src} alt={imagen.alt} className="img-fluid rounded" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GaleriaImagenes;
