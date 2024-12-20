import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/MenuPrincipal.css';
import caja_image from '../images/imagen_inicio.jpeg';
import TiposCartasCarousel from '../components/TiposCartasCarousel';
import CaracteristicasJuego from '../components/CaracteristicasJuego';
import UltimasNoticias from '../components/UltimasNoticias';
import ContadorRegresivo from '../components/ContadorRegresivo';
import GaleriaImagenes from '../components/GaleriaImagenes';
import Footer from '../components/Footer';

const MenuPrincipal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="menu-principal game-interface">
      <main className="main-container">
        <motion.section 
          className="hero-section text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-content p-4 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <h1 className="main-title">Bienvenido a Pixcard</h1>
            <p className="main-description">
              Sumérgete en un mundo de estrategia y poder. Construye tu mazo, 
              desata habilidades únicas, domina la batalla y conviertete en el campeón de este mundo.
            </p>
          </div>
        </motion.section>

        <CaracteristicasJuego />

        <motion.section 
          className="featured-section d-flex justify-content-center align-items-center mt-5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src={caja_image} alt="Cartas de Pixcard" className="featured-image small-featured-image" />
          <div className="featured-text ms-4 p-4 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <h2 className="featured-title">Tu Destino te Espera</h2>
            <p className="featured-description">
              En Pixcard, cada carta cuenta una historia, cada jugada puede cambiar el destino. Sumergete en duelos de cartas de accion con arte pixeleado, colecciona cartas, lucha con ellas y avanza a la cima en la tabla de calificaciones.
              ¿Tienes lo necesario para enfrentar el desafío y reclamar la victoria?
            </p>
          </div>
        </motion.section>

        <motion.div 
          className="text-center mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/registro" className="btn btn-action btn-lg pulse-animation" style={{ color: 'yellow' }}>¡Inicia tu Aventura!</Link>
        </motion.div>
      </main>

      <TiposCartasCarousel />

      <UltimasNoticias />

      <div>
      <ContadorRegresivo targetDate="2025-03-01T00:00:00" />
      </div>

      <GaleriaImagenes />

      <Footer />
    </div>
  );
};

export default MenuPrincipal;

