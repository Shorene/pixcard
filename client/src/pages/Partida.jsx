import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Partida = () => {
  const { id } = useParams(); // Obtenemos el ID de la partida desde la URL
  const navigate = useNavigate();
  const [partida, setPartida] = useState(null);
  const [error, setError] = useState(null);
  const usuarioId = JSON.parse(localStorage.getItem("userId")); // Obtenemos el ID del usuario

  useEffect(() => {
    const obtenerPartida = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/partidas/${id}`);
        setPartida(response.data);
      } catch (err) {
        setError("Error al cargar la partida.");
      }
    };

    obtenerPartida();
  }, [id]);

  const rendirse = async () => {
    try {
      console.log("Enviando rendición", { partida_id: id, jugador_id: usuarioId });
  
      // Enviar solicitud al backend para rendirse
      const response = await axios.put("http://localhost:3001/api/partidas/rendirse", {
        partida_id: id,
        jugador_id: usuarioId, // Asegúrate de que este valor sea correcto
      });
  
      const { ganador_id, jugadores } = response.data;
      alert(`Te rendiste. El ganador de la partida es el jugador con ID: ${ganador_id}`);
  
      // Redirigir a ambos jugadores a la página de DueloClasico
      if (jugadores) {
        // Si ambos jugadores fueron enviados
        navigate("/duelo-clasico"); // Redirige a la página donde ambas personas pueden ver las partidas
      }
    } catch (err) {
      console.error("Error al rendirse:", err);
      setError("Hubo un error al rendirse.");
    }
  };
  
  

  const manejarSalir = () => {
    navigate("/inicio");
  };

  if (!partida) {
    return <div>Cargando partida...</div>;
  }

  return (
    <div className="container text-center mt-5">
      <h2>Partida {id}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div>
        <h3>Estado: {partida.estado}</h3>
        <p>Jugador 1: {partida.jugador_1_id}</p>
        <p>Jugador 2: {partida.jugador_2_id || "Esperando..."}</p>
        <button className="btn btn-danger mt-3" onClick={rendirse}>
          Rendirse
        </button>
      </div>
      <button className="btn btn-secondary mt-3" onClick={manejarSalir}>
        Salir
      </button>
    </div>
  );
};

export default Partida;
