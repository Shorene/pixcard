import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, Trophy } from 'lucide-react';

const caracteristicas = [
  { icon: Sword, title: 'Combate Estratégico', description: 'Planifica tus movimientos y vence a tus oponentes' },
  { icon: Shield, title: 'Defensa Táctica', description: 'Protege tus unidades y territorio con habilidad' },
  { icon: Zap, title: 'Hechizos Poderosos', description: 'Desata magia devastadora en el campo de batalla' },
  { icon: Trophy, title: 'Torneos Épicos', description: 'Compite contra jugadores de todo el mundo' },
];

const CaracteristicasJuego = () => {
  return (
    <section className="caracteristicas-juego my-5">
      <h2 className="text-center mb-4" style={{ color: 'yellow' }}>Características del Juego</h2>
      <div className="row">
        {caracteristicas.map((caracteristica, index) => (
          <motion.div
            key={index}
            className="col-md-3 col-sm-6 mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="caracteristica-card text-center p-3">
              <caracteristica.icon size={48} className="mb-3 caracteristica-icon" />
              <h3 className="h5">{caracteristica.title}</h3>
              <p>{caracteristica.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CaracteristicasJuego;

