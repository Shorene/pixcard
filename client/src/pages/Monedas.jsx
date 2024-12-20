import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Monedas = () => {
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
  const [selectedUsuario, setSelectedUsuario] = useState(""); // Usuario seleccionado
  const [oro, setOro] = useState(""); // Cantidad de oro
  const [minicoins, setMinicoins] = useState(""); // Cantidad de minicoins
  const [error, setError] = useState(""); // Mensaje de error
  const [success, setSuccess] = useState(""); // Mensaje de éxito
  

  // Cargar usuarios al montar el componente
  useEffect(() => {
    Axios.get("http://localhost:3001/api/usuarios/todos")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        setError("No se pudo cargar la lista de usuarios.");
      });
  }, []);

  const handleSubmit = () => {
    if (!selectedUsuario) {
      setError("Por favor, selecciona un usuario.");
      setSuccess(""); // Limpiar el mensaje de éxito
      return;
    }
  
    if (!oro || !minicoins) {
      setError("Por favor, ingresa las cantidades de oro y minicoins.");
      setSuccess(""); // Limpiar el mensaje de éxito
      return;
    }
  
    const data = [
      {
        id_usuario: selectedUsuario,
        tipo_moneda: "oro",
        cantidad: parseInt(oro, 10),
      },
      {
        id_usuario: selectedUsuario,
        tipo_moneda: "minicoins",
        cantidad: parseInt(minicoins, 10),
      },
    ];
  
    // Usamos Promise.all para enviar dos solicitudes POST, una para "oro" y otra para "minicoins"
    Promise.all(
      data.map((item) =>
        Axios.post("http://localhost:3001/api/monedas", {
          id_usuario: item.id_usuario,
          tipo_moneda: item.tipo_moneda,
          cantidad: item.cantidad,
        })
      )
    )
      .then(() => {
        setSuccess("Monedas añadidas correctamente.");
        setError(""); // Limpiar mensaje de error
      })
      .catch((error) => {
        console.error("Error al añadir las monedas:", error);
        setError("Hubo un error al añadir las monedas.");
        setSuccess(""); // Limpiar mensaje de éxito
      });
  };

  return (
    <div>
      <h1>Añadir Monedas</h1>

      {/* Mostrar alerta de éxito o error */}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="usuario">Selecciona un usuario:</label>
        <select
          id="usuario"
          value={selectedUsuario}
          onChange={(e) => setSelectedUsuario(e.target.value)}
        >
          <option value="">Seleccione un usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.usuario}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="oro">Oro:</label>
        <input
          type="number"
          id="oro"
          value={oro}
          onChange={(e) => setOro(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="minicoins">Minicoins:</label>
        <input
          type="number"
          id="minicoins"
          value={minicoins}
          onChange={(e) => setMinicoins(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit} className="btn btn-primary mt-4">
        Añadir Monedas
      </button>
    </div>
  );
};

export default Monedas;
