import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, Sword, CreditCard, ShoppingBag, Layers, LogOut } from 'lucide-react';
import '../styles/Inicio.css';
import Footer from '../components/Footer';

const Inicio = () => {
  const [usuariosConectados, setUsuariosConectados] = useState([]);
  const [monedas, setMonedas] = useState({ oro: 0, minicoins: 0 });
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [cargandoMonedas, setCargandoMonedas] = useState(true);
  const [errorUsuarios, setErrorUsuarios] = useState("");
  const [errorMonedas, setErrorMonedas] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuariosConectados = () => {
      Axios.get("http://localhost:3001/api/usuarios/usuarios-conectados")
        .then((response) => {
          setUsuariosConectados(response.data);
          setCargandoUsuarios(false);
        })
        .catch((error) => {
          console.error("Error al obtener usuarios conectados:", error);
          setErrorUsuarios("Hubo un error al cargar los usuarios conectados.");
          setCargandoUsuarios(false);
        });
    };

    obtenerUsuariosConectados();
    const intervaloUsuarios = setInterval(obtenerUsuariosConectados, 30000);

    return () => clearInterval(intervaloUsuarios);
  }, []);

  useEffect(() => {
    const obtenerMonedas = () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setErrorMonedas("No se encontró un ID de usuario.");
        setCargandoMonedas(false);
        return;
      }

      Axios.get(`http://localhost:3001/api/monedas/${userId}`)
        .then((response) => {
          const { oro, minicoins } = response.data;
          setMonedas({ oro, minicoins });
          setCargandoMonedas(false);
        })
        .catch((error) => {
          console.error("Error al obtener las monedas del usuario:", error);
          setErrorMonedas("Hubo un error al cargar las monedas.");
          setCargandoMonedas(false);
        });
    };

    obtenerMonedas();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (cargandoUsuarios || cargandoMonedas) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando el mundo de Pixcard...</p>
      </div>
    );
  }

  if (errorUsuarios || errorMonedas) {
    return (
      <div className="error-screen">
        <h2>¡Ups! Parece que hay un problema</h2>
        {errorUsuarios && <p>{errorUsuarios}</p>}
        {errorMonedas && <p>{errorMonedas}</p>}
        <button onClick={() => window.location.reload()} className="btn-retry">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="inicio-container">
      <header className="inicio-header">
        <h1>Bienvenido a Pixcard</h1>
        <div className="monedas-info">
          <span className="oro">🪙 {monedas.oro}</span>
          <span className="minicoins">💎 {monedas.minicoins}</span>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuAbierto ? <X /> : <Menu />}
        </button>
      </header>

      <motion.nav 
        className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}
        initial={{ x: "100%" }}
        animate={{ x: menuAbierto ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ul>
          <li onClick={() => handleNavigation('/perfil')}><User /> Perfil</li>
          <li onClick={() => handleNavigation('/duelos')}><Sword /> Duelos</li>
          <li onClick={() => handleNavigation('/cartas')}><CreditCard /> Cartas</li>
          <li onClick={() => handleNavigation('/tienda')}><ShoppingBag /> Tienda</li>
          <li onClick={() => handleNavigation('/mazos')}><Layers /> Mazos</li>
          <li onClick={handleLogout}><LogOut /> Cerrar Sesión</li>
        </ul>
      </motion.nav>

      <main className="inicio-main">
        <section className="seccion-juego">
          <h2>¡Prepárate para la batalla!</h2>
          <p>Desafía a otros jugadores y demuestra tu valía en el campo de batalla.</p>
          <button onClick={() => handleNavigation('/duelos')} className="btn-jugar">
            ¡Jugar Ahora!
          </button>
        </section>

        <section className="seccion-estadisticas">
          <h2>Tus Estadísticas</h2>
          <div className="estadisticas-grid">
            <div className="estadistica-item">
              <h3>Victorias</h3>
              <p>15</p>
            </div>
            <div className="estadistica-item">
              <h3>Derrotas</h3>
              <p>5</p>
            </div>
            <div className="estadistica-item">
              <h3>Racha</h3>
              <p>3</p>
            </div>
            <div className="estadistica-item">
              <h3>Rango</h3>
              <p>Plata II</p>
            </div>
          </div>
        </section>

        <section className="seccion-usuarios">
          <h2>Jugadores en línea</h2>
          <div className="lista-usuarios">
            {usuariosConectados.length > 0 ? (
              usuariosConectados.map((usuario) => (
                <div key={usuario.id} className="usuario-item">
                  <span className="nombre-usuario">{usuario.usuario}</span>
                  <span className={`estado-usuario ${usuario.estado}`}>
                    {usuario.estado === "activo" ? "🟢" : "🔴"}
                  </span>
                </div>
              ))
            ) : (
              <p>No hay jugadores en línea en este momento.</p>
            )}
          </div>
        </section>

        <section className="seccion-acciones">
          <div className="accion-item" onClick={() => handleNavigation('/cartas')}>
            <CreditCard size={48} />
            <span>Mis Cartas</span>
          </div>
          <div className="accion-item" onClick={() => handleNavigation('/tienda')}>
            <ShoppingBag size={48} />
            <span>Tienda</span>
          </div>
          <div className="accion-item" onClick={() => handleNavigation('/mazos')}>
            <Layers size={48} />
            <span>Mis Mazos</span>
          </div>
        </section>

        <section className="seccion-noticias">
          <h2>Últimas Noticias</h2>
          <div className="noticias-lista">
            <div className="noticia-item">
              <h3>Nuevo set de cartas disponible</h3>
              <p>¡Descubre las nuevas cartas legendarias que han llegado a Pixcard!</p>
            </div>
            <div className="noticia-item">
              <h3>Torneo mensual</h3>
              <p>Prepárate para el gran torneo. ¡Grandes premios te esperan!</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Inicio;

