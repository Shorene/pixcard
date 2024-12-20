import React from "react";
import { useNavigate } from "react-router-dom";

const Duelos = () => {
  const navigate = useNavigate(); // Hook para navegar a otras páginas

  const handleSalir = () => {
    // Redirige al usuario a la página de inicio
    navigate("/inicio");
  };

  const handleDueloClasico = () => {
    // Redirige a la página de duelo clásico
    navigate("/duelo-clasico");
  };

  return (
    <div className="container text-center mt-5">
      <h2>Elige el tipo de duelo</h2>
      <div className="d-grid gap-2 col-6 mx-auto">
        <button className="btn btn-primary" onClick={handleDueloClasico}>
          Clásico
        </button>
        <button className="btn btn-secondary" onClick={handleSalir}>
          Salir
        </button>
        {/* Los otros botones pueden ser agregados cuando lo necesites */}
        <button className="btn btn-info">
          Competitivo (próximamente)
        </button>
        <button className="btn btn-warning">
          Duelo con Amigos (próximamente)
        </button>
      </div>
    </div>
  );
};

export default Duelos;
    