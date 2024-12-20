import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Acerca de Pixcard</h5>
            <p>Un juego de cartas estratégico que desafía tu mente y pone a prueba tus habilidades.</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/juego">Juego</Link></li>
              <li><Link to="/cartas">Cartas</Link></li>
              <li><Link to="/torneos">Torneos</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Síguenos</h5>
            <div className="social-icons">
              <a href="https://www.facebook.com/" className="me-2"><Facebook size={24} /></a>
              <a href="https://x.com/" className="me-2"><Twitter size={24} /></a>
              <a href="https://www.instagram.com/" className="me-2"><Instagram size={24} /></a>
              <a href="https://www.youtube.com/" className="me-2"><Youtube size={24} /></a>
            </div>
          </div>
        </div>
        <hr className="mt-4 mb-3" />
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p>&copy; 2024 Pixcard. Todos los derechos reservados.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/privacidad" className="me-3">Política de Privacidad</Link>
            <Link to="/terminos">Términos de Servicio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

