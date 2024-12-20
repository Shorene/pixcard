import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DueloClasico = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partida, setPartida] = useState(null);
  const usuarioId = JSON.parse(localStorage.getItem("userId")); // Obtenemos el ID del usuario

  useEffect(() => {
    const obtenerPartidaEsperando = async () => {
      try {
        // Intentamos obtener una partida con estado "esperando"
        const response = await axios.get("http://localhost:3001/api/partidas/esperando");

        if (response.data) {
          // Si encontramos una partida en espera, la mostramos y damos la opción de unirse
          setPartida(response.data);
        } else {
          // Si no encontramos una partida esperando, creamos una nueva partida
          await crearNuevaPartida();
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Si no encontramos ninguna partida esperando, creamos una nueva
          await crearNuevaPartida();
        } else {
          setError("Hubo un error al obtener las partidas.");
        }
      } finally {
        setLoading(false);
      }
    };

    const crearNuevaPartida = async () => {
      try {
        // Creamos una nueva partida si no hay partidas esperando
        const response = await axios.post("http://localhost:3001/api/partidas", { jugador_id: usuarioId });
        setPartida({ id: response.data.partidaId, estado: "esperando", jugador_1_id: usuarioId });

        // Redirigimos automáticamente a la nueva partida
        navigate(`/partida/${response.data.partidaId}`);
      } catch (err) {
        setError("Hubo un error al crear la partida.");
      }
    };

    obtenerPartidaEsperando();
  }, [usuarioId, navigate]);

  const unirseAPartida = async () => {
    try {
      if (partida) {
        // Unimos al jugador a la partida
        await axios.put("http://localhost:3001/api/partidas/unir", {
          partida_id: partida.id,
          jugador_2_id: usuarioId,
        });

        // Redirige a la página de la partida
        navigate(`/partida/${partida.id}`);
      }
    } catch (err) {
      setError("Hubo un error al unirse a la partida.");
    }
  };

  const manejarSalir = () => {
    navigate("/inicio");
  };

  const rendirse = async () => {
    try {
      if (partida) {
        // Enviar solicitud al backend para rendirse
        const response = await axios.put("http://localhost:3001/api/partidas/rendirse", {
          partida_id: partida.id,
          jugador_id: usuarioId,
        });

        const { ganador_id } = response.data;

        alert(`Te rendiste. El ganador de la partida es el jugador con ID: ${ganador_id}`);
        navigate("/inicio"); // Redirigir al inicio
      }
    } catch (err) {
      setError("Hubo un error al rendirse.");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container text-center mt-5">
      <h2>Duelo Clásico</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {partida ? (
        <div>
          <h3>Partida disponible</h3>
          {partida.jugador_1_id === usuarioId ? (
            <p>Esperando al segundo jugador...</p>
          ) : (
            <button className="btn btn-success" onClick={unirseAPartida}>
              Unirse a la partida
            </button>
          )}
          <button className="btn btn-danger mt-3" onClick={rendirse}>
            Rendirse
          </button>
        </div>
      ) : (
        <div>
          <h3>Se está creando una nueva partida...</h3>
        </div>
      )}
      <button className="btn btn-secondary" onClick={manejarSalir}>
        Salir
      </button>
    </div>
  );
};

export default DueloClasico;
