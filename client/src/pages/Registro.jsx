import React, { useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

const RegistroUsuario = () => {
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [repetirContrasenia, setRepetirContrasenia] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [errorUsuario, setErrorUsuario] = useState(""); // Estado para el error del usuario
  const [errorContrasenia, setErrorContrasenia] = useState(""); // Estado para los errores de la contraseña

  const navigate = useNavigate(); // Inicializamos el hook de navegación

  // Validación de la contraseña
  const validarContrasenia = (contrasenia) => {
    // Expresión regular para verificar la contraseña
    const regexContrasenia = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regexContrasenia.test(contrasenia);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que las contraseñas coinciden
    if (contrasenia !== repetirContrasenia) {
      setMensajeError("Las contraseñas no coinciden.");
      return;
    }

    // Validar que los campos no estén vacíos
    if (!usuario || !correo || !contrasenia || !repetirContrasenia) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    // Validar la contraseña
    if (!validarContrasenia(contrasenia)) {
      setErrorContrasenia(
        "La contraseña debe tener al menos 8 caracteres, un número y una mayúscula."
      );
      return;
    } else {
      setErrorContrasenia(""); // Limpiar el error de contraseña
    }

    // Verificar si el nombre de usuario ya existe
Axios.post("http://localhost:3001/api/usuarios/check-usuario", { usuario })
.then((response) => {
  if (response.data.exists) {
    // Mostrar error si el usuario ya existe
    setErrorUsuario("El nombre de usuario ya está en uso.");
  } else {
    // Proceder con el registro si no existe
    setErrorUsuario(""); // Limpiar cualquier mensaje de error previo

    // Registro del usuario
    Axios.post("http://localhost:3001/api/usuarios/register", {
      usuario,
      correo,
      contrasenia,
    })
      .then(() => {
        Swal.fire({
          title: "Registro exitoso",
          text: "¡Te has registrado exitosamente!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/"); // Redirigir al menú principal
          }
        });

        // Limpiar los campos después del registro
        setUsuario("");
        setCorreo("");
        setContrasenia("");
        setRepetirContrasenia("");
        setMensajeError("");
      })
      .catch((error) => {
        console.error(
          "Error de registro:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error en el registro.",
          icon: "error",
        });
      });
  }
})
.catch((error) => {
  console.error(
    "Error en la verificación del usuario:",
    error.response ? error.response.data : error.message
  );
  Swal.fire({
    title: "Error",
    text: "Hubo un error al verificar el usuario.",
    icon: "error",
  });
});

  };

  return (
    <div className="container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de usuario:</label>
          <input
            type="text"
            className="form-control"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          {errorUsuario && (
            <p className="text-danger">{errorUsuario}</p>
          )} {/* Mostrar error de usuario */}
        </div>

        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />
          {errorContrasenia && (
            <p className="text-danger">{errorContrasenia}</p>
          )} {/* Mostrar error de contraseña */}
        </div>

        <div className="form-group">
          <label>Repetir Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={repetirContrasenia}
            onChange={(e) => setRepetirContrasenia(e.target.value)}
            required
          />
        </div>

        {mensajeError && (
          <p className="text-danger">{mensajeError}</p>
        )} {/* Mostrar error de contraseñas no coincidentes */}

        <br />

        <button type="submit" className="btn btn-primary">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
