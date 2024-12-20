import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../styles/Mazos.css";

const Mazos = () => {
  const [cartas, setCartas] = useState([]);
  const [mazos, setMazos] = useState([]);
  const [cargandoCartas, setCargandoCartas] = useState(true);
  const [error, setError] = useState("");
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [nombreMazo, setNombreMazo] = useState("");
  const [espaciosMazo, setEspaciosMazo] = useState(Array(10).fill(null));
  const [creandoMazo, setCreandoMazo] = useState(false);
  const [editandoMazoId, setEditandoMazoId] = useState(null);
  const [mostrarMisCartas, setMostrarMisCartas] = useState(false);
  const [misCartas, setMisCartas] = useState([]);
  const [cantidadCartas, setCantidadCartas] = useState({});

  useEffect(() => {
    cargarCartas();
    cargarMazos();
    cargarMisCartas();
  }, []);

  const cargarMisCartas = () => {
    const usuarioId = localStorage.getItem("userId");
    Axios.get(`http://localhost:3001/api/usuariosCartas/${usuarioId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMisCartas(response.data);
          const cantidadCartas = {};
          response.data.forEach((carta) => {
            cantidadCartas[carta.id] = carta.cantidad;
          });
          setCantidadCartas(cantidadCartas);
        } else {
          console.error("La respuesta de la API no es un arreglo", response.data);
          setMisCartas([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar las cartas del usuario:", error);
        setError("Hubo un problema al cargar tus cartas.");
      });
  };

  const cargarCartas = () => {
    Axios.get("http://localhost:3001/api/cartas")
      .then((response) => {
        setCartas(response.data);
        setCargandoCartas(false);
      })
      .catch((error) => {
        console.error("Error al obtener cartas:", error);
        setError("Hubo un error al cargar las cartas.");
        setCargandoCartas(false);
      });
  };

  const cargarMazos = () => {
    const usuarioId = localStorage.getItem("userId");
    Axios.get(`http://localhost:3001/api/mazos/${usuarioId}`)
      .then((response) => {
        setMazos(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar mazos:", error);
        setError("Hubo un error al cargar los mazos.");
      });
  };

  const manejarClickMazo = (mazoId) => {
    if (!mazoId) {
      alert("ID de mazo no válido.");
      return;
    }

    Axios.get(`http://localhost:3001/api/mazos/mazos_cartas/${mazoId}`)
      .then((response) => {
        const cartasDelMazo = response.data;
        const nuevosEspacios = Array(10).fill(null);
        cartasDelMazo.forEach((carta, index) => {
          if (index < 10) {
            nuevosEspacios[index] = carta;
          }
        });
        const mazoSeleccionado = mazos.find((mazo) => mazo.id === mazoId);
        setNombreMazo(mazoSeleccionado ? mazoSeleccionado.nombre : "");
        setEspaciosMazo(nuevosEspacios);
        setEditandoMazoId(mazoId);
        setCreandoMazo(true);
      })
      .catch((error) => {
        console.error("Error al obtener cartas del mazo:", error);
        alert("No se pudieron cargar las cartas del mazo seleccionado.");
      });
  };

  const manejarClickCarta = (carta) => {
    setCartaSeleccionada(carta);
  };

  const cerrarDetallesCarta = () => {
    setCartaSeleccionada(null);
  };

  const crearMazo = () => {
    setCreandoMazo(true);
    setEditandoMazoId(null);
    setNombreMazo("");
    setEspaciosMazo(Array(10).fill(null));
  };

  const manejarArrastrar = (carta, desdeMazo = false) => (e) => {
    e.dataTransfer.setData("carta", JSON.stringify(carta));
    e.dataTransfer.setData("desdeMazo", JSON.stringify(desdeMazo));
  };

  const manejarSoltar = (index) => (e) => {
    e.preventDefault();
    const carta = JSON.parse(e.dataTransfer.getData("carta"));
    const desdeMazo = JSON.parse(e.dataTransfer.getData("desdeMazo"));

    if (desdeMazo) {
      const nuevosEspacios = [...espaciosMazo];
      const indexCarta = nuevosEspacios.findIndex((espacio) => espacio && espacio.id === carta.id);
      if (indexCarta !== -1) {
        nuevosEspacios[indexCarta] = null;
        setEspaciosMazo(nuevosEspacios);
      }
    }

    if (!espaciosMazo[index]) {
      const nuevosEspacios = [...espaciosMazo];
      nuevosEspacios[index] = carta;
      setEspaciosMazo(nuevosEspacios);
    }
  };

  const manejarEliminarDelMazo = (e) => {
    e.preventDefault();
    const carta = JSON.parse(e.dataTransfer.getData("carta"));
    const desdeMazo = JSON.parse(e.dataTransfer.getData("desdeMazo"));

    if (!desdeMazo) return;

    const nuevosEspacios = [...espaciosMazo];
    const indexCarta = nuevosEspacios.findIndex(
      (espacio) => espacio && espacio.id === carta.id
    );

    if (indexCarta !== -1) {
      nuevosEspacios[indexCarta] = null;
      setEspaciosMazo(nuevosEspacios);
    }
  };

  const guardarMazo = () => {
    if (!nombreMazo) {
      alert("Por favor, ingresa un nombre para el mazo.");
      return;
    }

    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      alert("No se encontró el ID del usuario. Por favor, inicia sesión de nuevo.");
      return;
    }

    const cartasDelMazo = espaciosMazo
      .filter((carta) => carta !== null)
      .map((carta) => ({ carta_id: carta.id, cantidad: 1 }));

    const mazo = { nombre: nombreMazo, usuario_id: parseInt(usuarioId, 10), cartas: cartasDelMazo };

    const request = editandoMazoId
      ? Axios.put(`http://localhost:3001/api/mazos/${editandoMazoId}`, mazo)
      : Axios.post("http://localhost:3001/api/mazos", mazo);

    request
      .then(() => {
        alert(editandoMazoId ? "Mazo actualizado con éxito" : "Mazo guardado con éxito");
        setCreandoMazo(false);
        setEspaciosMazo(Array(10).fill(null));
        cargarMazos();
      })
      .catch((error) => {
        console.error("Error al guardar el mazo:", error);
        alert("Hubo un problema al guardar el mazo.");
      });
  };

  const cancelarMazo = () => {
    setCreandoMazo(false);
    setEspaciosMazo(Array(10).fill(null));
    setNombreMazo("");
  };

  return (
    <div className="mazos-container">
      <header className="mazos-header">
        <h1>Mis Mazos</h1>
        <div className="mazos-existentes">
          {mazos.map((mazo) => (
            <button
              key={mazo.id}
              className="btn-mazo"
              onClick={() => manejarClickMazo(mazo.id)}
            >
              {mazo.nombre}
            </button>
          ))}
        </div>
        <button className="btn-crear-mazo" onClick={crearMazo}>
          Crear Nuevo Mazo
        </button>
      </header>

     <main className="mazos-main">
  {cargandoCartas && <p>Cargando cartas...</p>}
  {error && <p style={{ color: 'red' }}>{error}</p>}

  {creandoMazo && (
    <div className="crear-mazo-container">
      <h2>{editandoMazoId ? "Editar Mazo" : "Crear Mazo"}</h2>
      <input
        type="text"
        value={nombreMazo}
        onChange={(e) => setNombreMazo(e.target.value)}
        placeholder="Nombre del mazo"
        className="input-nombre-mazo"
      />
      <div className="mazo-espacios">
        {espaciosMazo.map((carta, index) => (
          <div
            key={index}
            className={`espacio-carta ${carta ? 'ocupado' : ''}`}
            onDrop={manejarSoltar(index)}
            onDragOver={(e) => e.preventDefault()}
          >
            {carta ? (
              <img
                src={`http://localhost:3001/images/cartas/${carta.imagen}`}
                alt={carta.nombre}
                className="carta-imagen"
                onClick={() => manejarClickCarta(carta)}
                draggable
                onDragStart={manejarArrastrar(carta, true)}
              />
            ) : (
              <p>Espacio {index + 1}</p>
            )}
          </div>
        ))}
      </div>
      <div className="botones-mazo">
        <button className="btn-guardar" onClick={guardarMazo}>
          {editandoMazoId ? "Guardar Cambios" : "Guardar Mazo"}
        </button>
        <button className="btn-cancelar" onClick={cancelarMazo}>
          Cancelar
        </button>
      </div>
    </div>
  )}

  <h2>Colección de Cartas</h2>
  <div className="toggle-container">
    <label className="switch">
      <input
        type="checkbox"
        checked={mostrarMisCartas}
        onChange={() => setMostrarMisCartas(!mostrarMisCartas)}
      />
      <span className="slider round"></span>
    </label>
    <span>{mostrarMisCartas ? "Mis Cartas" : "Todas las Cartas"}</span>
  </div>

  <div 
    className="card-grid" 
    onDrop={manejarEliminarDelMazo} 
    onDragOver={(e) => e.preventDefault()}
  >
    {(mostrarMisCartas ? misCartas : cartas).map((carta) => {
      const cantidad = cantidadCartas[carta.id] || 0;
      return (
        <div key={carta.id} className="card-item">
          <img
            src={`http://localhost:3001/images/cartas/${carta.imagen}`}
            alt={carta.nombre}
            className="carta-imagen"
            onClick={() => manejarClickCarta(carta)}
            draggable
            onDragStart={manejarArrastrar(carta, false)}
          />
          <div className="cantidad-carta">{cantidad}</div>
        </div>
      );
    })}
  </div>
</main>


      {cartaSeleccionada && (
        <div className="overlay" onClick={cerrarDetallesCarta}>
          <div className="carta-detalle" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:3001/images/cartas/${cartaSeleccionada.imagen}`}
              alt={cartaSeleccionada.nombre}
              className="carta-imagen-grande"
            />
            <div className="carta-info">
              <h3>{cartaSeleccionada.nombre}</h3>
              <p><strong>Tipo:</strong> {cartaSeleccionada.tipo}</p>
              <p><strong>Rareza:</strong> {cartaSeleccionada.rareza}</p>
              <p><strong>Descripción:</strong> {cartaSeleccionada.descripcion}</p>
              {/* Añade más detalles de la carta aquí */}
            </div>
            <button className="btn-cerrar" onClick={cerrarDetallesCarta}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mazos;

