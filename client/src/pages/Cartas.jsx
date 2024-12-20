import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, X, Trash2 } from 'lucide-react';
import "../styles/Cartas.css";

const Cartas = () => {
  const [cartas, setCartas] = useState([]);
  const [nombreCarta, setNombreCarta] = useState("");
  const [descripcionCarta, setDescripcionCarta] = useState("");
  const [tipoCarta, setTipoCarta] = useState("monstruo");
  const [tipoMonstruo, setTipoMonstruo] = useState("orco");
  const [nivelCarta, setNivelCarta] = useState("");
  const [ataqueCarta, setAtaqueCarta] = useState("");
  const [defensaCarta, setDefensaCarta] = useState("");
  const [imagenCarta, setImagenCarta] = useState(null);
  const [editando, setEditando] = useState(false);
  const [idCartaEditar, setIdCartaEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);

  useEffect(() => {
    cargarCartas();
  }, []);

  const cargarCartas = () => {
    Axios.get("http://localhost:3001/api/cartas")
      .then((response) => setCartas(response.data))
      .catch((error) => {
        console.error("Error al obtener cartas:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al cargar las cartas",
          icon: "error",
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !nombreCarta ||
      !descripcionCarta ||
      !tipoCarta ||
      !nivelCarta ||
      !ataqueCarta ||
      !defensaCarta ||
      (!editando && !imagenCarta)
    ) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombreCarta);
    formData.append("descripcion", descripcionCarta);
    formData.append("tipo", tipoMonstruo);
    formData.append("nivel", nivelCarta);
    formData.append("ataque", ataqueCarta);
    formData.append("defensa", defensaCarta);
    formData.append("tipo_carta", tipoCarta);
    if (imagenCarta) {
      formData.append("imagen", imagenCarta);
    }

    if (editando) {
      Axios.put(`http://localhost:3001/api/cartas/${idCartaEditar}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          Swal.fire({
            title: "Éxito",
            text: "Carta actualizada correctamente",
            icon: "success",
          });

          const actualizada = response.data;
          setCartas(cartas.map((carta) => (carta.id === idCartaEditar ? actualizada : carta)));
          resetFormulario();
        })
        .catch((error) => {
          console.error("Error al actualizar la carta:", error);
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al actualizar la carta",
            icon: "error",
          });
        });
    } else {
      Axios.post("http://localhost:3001/api/cartas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          Swal.fire({
            title: "Éxito",
            text: "Carta creada correctamente",
            icon: "success",
          });

          setCartas([...cartas, response.data]);
          resetFormulario();
        })
        .catch((error) => {
          console.error("Error al crear la carta:", error);
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al crear la carta",
            icon: "error",
          });
        });
    }
  };

  const resetFormulario = () => {
    setNombreCarta("");
    setDescripcionCarta("");
    setTipoCarta("monstruo");
    setTipoMonstruo("orco");
    setNivelCarta("");
    setAtaqueCarta("");
    setDefensaCarta("");
    setImagenCarta(null);
    setEditando(false);
    setIdCartaEditar(null);
    setMostrarFormulario(false);
  };

  const handleEditarCarta = (carta) => {
    setEditando(true);
    setIdCartaEditar(carta.id);
    setNombreCarta(carta.nombre);
    setDescripcionCarta(carta.descripcion);
    setTipoCarta(carta.tipo_carta);
    setTipoMonstruo(carta.tipo);
    setNivelCarta(carta.nivel);
    setAtaqueCarta(carta.ataque);
    setDefensaCarta(carta.defensa);
    setImagenCarta(null);
    setMostrarFormulario(true);
    setCartaSeleccionada(null);
  };

  const handleEliminarCarta = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/api/cartas/${id}`)
          .then(() => {
            setCartas(cartas.filter(carta => carta.id !== id));
            Swal.fire(
              'Eliminada',
              'La carta ha sido eliminada.',
              'success'
            );
            setCartaSeleccionada(null);
          })
          .catch((error) => {
            console.error("Error al eliminar la carta:", error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la carta.',
              'error'
            );
          });
      }
    });
  };

  const handleTipoCartaChange = (e) => {
    const selectedTipo = e.target.value;
    setTipoCarta(selectedTipo);
    if (selectedTipo !== "monstruo") {
      setTipoMonstruo("");
    }
  };

  const cartasFiltradas = cartas.filter(carta => 
    filtroTipo === "todos" || carta.tipo_carta === filtroTipo
  );

  const manejarClickCarta = (carta) => {
    setCartaSeleccionada(carta.id === cartaSeleccionada ? null : carta.id);
  };

  const cerrarDetallesCarta = () => {
    setCartaSeleccionada(null);
  };

  return (
    <div className="cartas-container">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Gestionar Cartas
      </motion.h1>

      <motion.div 
        className="controles"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button 
          className="btn-agregar" 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? <X /> : <Plus />}
          {mostrarFormulario ? "Cerrar" : "Agregar Carta"}
        </button>
        <select 
          value={filtroTipo} 
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="filtro-tipo"
        >
          <option value="todos">Todos los tipos</option>
          <option value="monstruo">Monstruo</option>
          <option value="terreno">Terreno</option>
          <option value="hechizo">Hechizo</option>
        </select>
      </motion.div>

      <AnimatePresence>
        {mostrarFormulario && (
          <motion.form 
            onSubmit={handleSubmit}
            className="formulario-carta"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-group">
              <label>Nombre de la Carta:</label>
              <input
                type="text"
                value={nombreCarta}
                onChange={(e) => setNombreCarta(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción de la Carta:</label>
              <textarea
                value={descripcionCarta}
                onChange={(e) => setDescripcionCarta(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Tipo de Carta:</label>
              <select
                value={tipoCarta}
                onChange={handleTipoCartaChange}
                required
              >
                <option value="monstruo">Monstruo</option>
                <option value="terreno">Terreno</option>
                <option value="hechizo">Hechizo</option>
              </select>
            </div>
            {tipoCarta === "monstruo" && (
              <div className="form-group">
                <label>Tipo de Monstruo:</label>
                <select
                  value={tipoMonstruo}
                  onChange={(e) => setTipoMonstruo(e.target.value)}
                  required
                >
                  <option value="orco">Orco</option>
                  <option value="humano">Humano</option>
                  <option value="enano">Enano</option>
                  <option value="elfo">Elfo</option>
                  <option value="bestia">Bestia</option>
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Nivel:</label>
              <input
                type="number"
                value={nivelCarta}
                onChange={(e) => setNivelCarta(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Ataque:</label>
              <input
                type="number"
                value={ataqueCarta}
                onChange={(e) => setAtaqueCarta(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Defensa:</label>
              <input
                type="number"
                value={defensaCarta}
                onChange={(e) => setDefensaCarta(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Imagen de la Carta:</label>
              <input
                type="file"
                onChange={(e) => setImagenCarta(e.target.files[0])}
                required={!editando}
              />
            </div>
            <button type="submit" className="btn-submit">
              {editando ? "Actualizar Carta" : "Crear Carta"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div 
        className="card-grid"
      >
        {cartasFiltradas.map((carta) => (
          <div key={carta.id} className="card-item">
            <img
              src={`http://localhost:3001/images/cartas/${carta.imagen}`}
              alt={carta.nombre}
              className="carta-imagen"
              onClick={() => manejarClickCarta(carta)}
            />
            <div className="cantidad-carta">{carta.cantidad || 0}</div>
          </div>
        ))}
      </motion.div>

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
              <p><strong>Tipo:</strong> {cartaSeleccionada.tipo_carta}</p>
              <p><strong>Rareza:</strong> {cartaSeleccionada.rareza}</p>
              <p><strong>Descripción:</strong> {cartaSeleccionada.descripcion}</p>
              <p><strong>Nivel:</strong> {cartaSeleccionada.nivel}</p>
              <p><strong>Ataque:</strong> {cartaSeleccionada.ataque}</p>
              <p><strong>Defensa:</strong> {cartaSeleccionada.defensa}</p>
            </div>
            <div className="carta-acciones">
              <button className="btn-editar" onClick={() => handleEditarCarta(cartaSeleccionada)}>
                <Edit2 size={16} />
                Editar
              </button>
              <button className="btn-eliminar" onClick={() => handleEliminarCarta(cartaSeleccionada.id)}>
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
            <button className="btn-cerrar" onClick={cerrarDetallesCarta}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cartas;

