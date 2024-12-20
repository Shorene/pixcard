import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../images/pixcard_logo.png';
import '../styles/Navegacion.css';

const Navegacion = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark custom-navbar ${isSticky ? 'sticky' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Pixcard Logo" className="logo-navbar" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/juego">Juego</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cartas">Cartas</Link>
            </li>
          </ul>
          <div className="d-flex">
            {isLoggedIn ? (
              <div className="user-menu-container">
                <button onClick={toggleUserMenu} className="btn btn-outline-light">
                  Mi Cuenta
                </button>
                {showUserMenu && (
                  <div className="user-menu">
                    <Link to="/perfil" className="user-menu-item">Perfil</Link>
                    <Link to="/mazos" className="user-menu-item">Mis Mazos</Link>
                    <Link to="/monedas" className="user-menu-item">Mis Monedas</Link>
                    <button onClick={handleLogout} className="user-menu-item logout-btn">Cerrar Sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">Iniciar Sesión</Link>
                <Link to="/registro" className="btn btn-golden btn-register" style={{ color: 'yellow' }}>Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navegacion;

