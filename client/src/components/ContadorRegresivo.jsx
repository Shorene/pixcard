import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ContadorRegresivo = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (difference < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]); // Ahora, el efecto se vuelve a ejecutar cuando cambia la fecha de destino

  return (
    <section className="contador-regresivo my-5 text-center">
      <h2 className="mb-4" style={{ color: 'yellow' }}>¡Estreno mundial!</h2>
      <div className="d-flex justify-content-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <motion.div
            key={unit}
            className="tiempo-unidad mx-3"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="tiempo-valor display-4">{value}</div>
            <div className="tiempo-etiqueta">{unit}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ContadorRegresivo;
