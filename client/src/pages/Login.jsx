import React, { useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const navigate = useNavigate(); // Para redirigir al usuario después de iniciar sesión

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que los campos no estén vacíos
    if (!usuario || !contrasenia) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    // Enviar los datos al backend para hacer login
    Axios.post("http://localhost:3001/api/usuarios/login", {
      usuario,
      contrasenia,
    })
      .then((response) => {
        const data = response.data;

        // Guardar el ID de usuario y otros datos relevantes en localStorage
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("userId", data.id); // Guardamos el ID aquí

        // Verificación en consola para asegurar que el ID esté guardado
        console.log("ID guardado en localStorage:", data.id);

        // Mostrar notificación de éxito
        Swal.fire({
          title: "Inicio de sesión exitoso",
          text: `Bienvenido, ${data.nombre || "usuario"}!`,
          icon: "success",
        }).then(() => {
          navigate("/inicio"); // Redirige al usuario a la página de inicio
        });
      })
      .catch((error) => {
        console.error(
          "Error de inicio de sesión:",
          error.response ? error.response.data : error.message
        );

        Swal.fire({
          title: "Error",
          text:
            error.response && error.response.data
              ? error.response.data.message
              : "Nombre de usuario o contraseña incorrectos",
          icon: "error",
        });
      });
  };

  return (
    <div className="container mt-4">
      <h2>Iniciar sesión</h2>
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
        </div>

        {mensajeError && <p className="text-danger mt-2">{mensajeError}</p>}

        <button type="submit" className="btn btn-primary mt-3">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
