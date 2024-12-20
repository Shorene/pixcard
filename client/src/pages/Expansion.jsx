import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import confetti from 'canvas-confetti';
import { Sparkles, TrendingUp } from 'lucide-react';
import "../styles/Expansion.css";

// Importa los sonidos
import boosterOpenSound from "../sounds/drawer-open-98801.mp3";
import cardRevealSound from "../sounds/game-bonus-144751.mp3";
import raritySound from "../sounds/notification-1-126509.mp3";

const Expansion = () => {
  const { id } = useParams();
  const [expansion, setExpansion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartas, setCartas] = useState([]);
  const [cartaActual, setCartaActual] = useState(null);
  const [indiceCartaActual, setIndiceCartaActual] = useState(0);
  const [mostrandoResumen, setMostrandoResumen] = useState(false);
  const [sobresAbiertos, setSobresAbiertos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [playBoosterOpen] = useSound(boosterOpenSound);
  const [playCardReveal] = useSound(cardRevealSound);
  const [playRaritySound] = useSound(raritySound);

  useEffect(() => {
    setExpansion({
      id: 1,
      nombre: "Génesis",
      descripcion: "La primera expansión de Pixcard",
      precio: 500,
    });
  }, [id]);

  const handleComprarSobre = async () => {
    setLoading(true);
    playBoosterOpen();

    const idUsuario = localStorage.getItem("userId");

    if (!idUsuario) {
      setLoading(false);
      return;
    }

    try {
      const response = await Axios.post("http://localhost:3001/api/usuariosCartas/comprar-sobre", { idUsuario, expansionId: id });
      setCartas(response.data.cartas);
      setIndiceCartaActual(0);
      setCartaActual(response.data.cartas[0]);
      setSobresAbiertos(prevState => prevState + 1);
      setRacha(prevState => prevState + 1);
      setMostrandoResumen(false);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error("Error al comprar el sobre:", error);
      setRacha(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSiguienteCarta = () => {
    playCardReveal();
    if (cartaActual.rareza === 'epica' || cartaActual.rareza === 'legendaria') {
      playRaritySound();
      confetti({
        particleCount: 300,
        spread: 100,
        origin: { y: 0.6 }
      });
    }

    const nuevoIndice = indiceCartaActual + 1;
    if (nuevoIndice < cartas.length) {
      setIndiceCartaActual(nuevoIndice);
      setCartaActual(cartas[nuevoIndice]);
    } else {
      setMostrandoResumen(true);
    }
  };

  const handleCerrarResumen = () => {
    setCartaActual(null);
    setCartas([]);
    setMostrandoResumen(false);
  };

  if (!expansion) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="expansion-container">
      <motion.h1 
        className="expansion-titulo"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {expansion.nombre}
      </motion.h1>
      <motion.p 
        className="expansion-descripcion"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {expansion.descripcion}
      </motion.p>
      <div className="stats-container">
        <motion.p 
          className="expansion-precio"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          Precio por sobre: {expansion.precio} oro
        </motion.p>
        <motion.p 
          className="sobres-abiertos"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          Sobres abiertos: {sobresAbiertos}
        </motion.p>
        <motion.div 
          className="racha"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <TrendingUp size={24} />
          <span>Racha: {racha}</span>
        </motion.div>
      </div>

      <motion.button
        className="btn-comprar-sobre"
        onClick={handleComprarSobre}
        disabled={loading || cartaActual}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <Sparkles size={24} />
            <span>Comprar y abrir sobre</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {cartaActual && !mostrandoResumen && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="carta-container">
              <motion.div
                className={`carta-item rareza-${cartaActual.rareza}`}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img
                  src={`http://localhost:3001/images/cartas/${cartaActual.imagen}`}
                  alt={cartaActual.nombre}
                  className="carta-imagen"
                />
              </motion.div>
              <motion.button 
                className="btn-siguiente"
                onClick={handleSiguienteCarta}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {indiceCartaActual < cartas.length - 1 ? "Siguiente Carta" : "Ver Resumen"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {mostrandoResumen && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="resumen-container">
              <h2>Cartas obtenidas</h2>
              <div className="resumen-cartas">
                {cartas.map((carta, index) => (
                  <motion.div
                    key={index}
                    className={`resumen-carta rareza-${carta.rareza}`}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2, type: "spring" }}
                  >
                    <img
                      src={`http://localhost:3001/images/cartas/${carta.imagen}`}
                      alt={carta.nombre}
                      className="resumen-carta-imagen"
                    />
                  </motion.div>
                ))}
              </div>
              <motion.button 
                className="btn-cerrar-resumen"
                onClick={handleCerrarResumen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expansion;

