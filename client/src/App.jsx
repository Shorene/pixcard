
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MenuPrincipal";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio"; // Importamos la nueva página de Inicio
import Cartas from "./pages/Cartas"; // Importamos la página de Cartas
import Duelos from "./pages/Duelos"; // Importamos la página de Duelos

import DueloClasico from "./pages/DueloClasico"; // Importamos la página de Duelo Clásico
import Navegacion from "./components/Navegacion"; // Importamos el componente Navegacion
import Monedas from "./pages/Monedas"; // Importamos la nueva página de Monedas
import Tienda from "./pages/Tienda"; // Importamos la nueva página de Tienda
import Mazos from "./pages/Mazos"; // Importamos la nueva página de Tienda
import Partida from "./pages/Partida";
import Expansion from './pages/Expansion';



import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

function App() {
  const [userId, setUserId] = useState(null); // Almacenamos el ID del usuario conectado

  useEffect(() => {
    // Recuperamos el usuario de localStorage (si existe)
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserId(userData.id); // Configuramos el ID del usuario
    }
  }, []);

  return (
    <Router>
      {userId && <Navegacion userId={userId} />} 
      <Routes>
        <Route path= "/" element={<MenuPrincipal/>} />
        
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio userId={userId} />} />
        <Route path="/cartas" element={<Cartas />} />
        <Route path="/duelos" element={<Duelos />} />
        <Route path="/duelo-clasico" element={<DueloClasico />} />
        <Route path="/monedas" element={<Monedas />} />
        <Route path="/tienda" element={<Tienda />} /> 
        <Route path="/mazos" element={<Mazos />} />
        <Route path="/partida/:id" element={<Partida />} />
        <Route path="/expansion/:id" element={<Expansion />} />
      </Routes>
    </Router>
  );
}

export default App;
