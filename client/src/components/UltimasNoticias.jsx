import React from 'react';
import { motion } from 'framer-motion';

const noticias = [

  { titulo: 'Primer vistazo: Arte conceptual revelado', fecha: '24/11/2024' },
  { titulo: 'Beta cerrada: ¡Apúntate para jugar antes que nadie!', fecha: '05/11/2024' },
  { titulo: 'Se busca equipo: ¡Únete al desarrollo!', fecha: '11/12/2024' },
  
];

const UltimasNoticias = () => {
  return (
    <section className="ultimas-noticias my-5">
      <h2 className="text-center mb-4" style={{ color: 'yellow' }}>Últimas Noticias</h2>
      <motion.div
        className="noticias-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {noticias.map((noticia, index) => (
          <motion.div
            key={index}
            className="noticia-item p-3 mb-3"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="h5">{noticia.titulo}</h3>
            <p style={{ color: 'yellow' }}>{noticia.fecha}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default UltimasNoticias;
