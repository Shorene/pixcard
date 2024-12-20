import React from 'react';
import { motion } from 'framer-motion';
import carrusel_terreno from '../images/carrusel_1-1.png';
import carrusel_monstruo from '../images/carrusel_2-2.png';
import carrusel_hechizo from '../images/carrusel_3-3.png';

const carouselItems = [
  {
    title: 'Terrenos',
    description: 'Domina la partida haciendo el uso de cartas tipo terreno, los cuales cambiaran tu campo a tu favor, otorgandoles beneficios unicos a tus unidades y asi conseguir la victoia.',
    image: carrusel_terreno,
  },
  {
    title: 'Monstruos',
    description: 'Invoca criaturas legendarias y desata su poder. Has uso de tus unidades para atacar o defenderte del rival. Evolucionalos mediante la partida para crear un ejercito perfecto e imbatible.',
    image: carrusel_monstruo,
  },
  {
    title: 'Hechizos',
    description: 'Manipula el destino con hechizos poderosos. Cambia las reglas del juego con magia ancestral. Sorprende a tu enemigo con cartas que cambiaran el curso de la partida.',
    image: carrusel_hechizo,
  },
];

const TiposCartasCarousel = () => {
  return (
    <motion.div 
      className="carousel-section custom-carousel-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h2 className="section-title text-center mt-5">Tipos de Cartas</h2>
      <div id="carouselCartas" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {carouselItems.map((item, index) => (
            <div key={item.title} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <motion.div 
                className="d-flex align-items-center justify-content-center flex-column flex-md-row"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.img 
                  src={item.image} 
                  alt={item.title} 
                  className="carousel-image mb-3 mb-md-0 me-md-4"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="carousel-text text-center text-md-start">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselCartas" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselCartas" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </motion.div>
  );
};

export default TiposCartasCarousel;

