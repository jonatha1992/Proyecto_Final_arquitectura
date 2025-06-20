import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Home from './Home';
import AuthDemo from './AuthDemo';
import Turnos from './Turnos';
import Precios from './Precios';
import Chatbot from './Chatbot';

function Navigation({ user }) {
  const location = useLocation();

  const navStyle = {
    backgroundColor: '#2196F3',
    padding: '1rem 0',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    transition: 'background-color 0.3s'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: 'rgba(255,255,255,0.2)'
  };

  const userInfoStyle = {
    color: 'white',
    fontSize: '0.9rem',
    opacity: 0.9
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          ✨ Depilación Definitiva
        </Link>
        <div style={navLinksStyle}>
          <Link
            to="/"
            style={location.pathname === '/' ? activeLinkStyle : linkStyle}
          >
            🏠 Inicio
          </Link>
          <Link
            to="/turnos"
            style={location.pathname === '/turnos' ? activeLinkStyle : linkStyle}
          >
            📅 Dashboard
          </Link>
          <Link
            to="/precios"
            style={location.pathname === '/precios' ? activeLinkStyle : linkStyle}
          >
            💰 Precios
          </Link>
          <Link
            to="/chatbot"
            style={location.pathname === '/chatbot' ? activeLinkStyle : linkStyle}
          >
            🤖 Asistente
          </Link>
          {user && (
            <div style={userInfoStyle}>
              👤 {user.email}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Navigation user={user} />
        <AuthDemo onAuth={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/turnos"
            element={
              user ? (
                <Turnos />
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  backgroundColor: 'white',
                  margin: '2rem auto',
                  maxWidth: '600px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <h2 style={{ color: '#333', marginBottom: '1rem' }}>
                    🔐 Acceso Restringido
                  </h2>
                  <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Inicia sesión para acceder al dashboard de turnos y gestionar tus citas.
                  </p>
                  <div style={{
                    backgroundColor: '#e3f2fd',
                    padding: '1rem',
                    borderRadius: '5px',
                    border: '1px solid #2196F3'
                  }}>
                    💡 <strong>Tip:</strong> Usa el panel de autenticación en la parte superior para ingresar.
                  </div>
                </div>
              )
            }
          />
          <Route path="/precios" element={<Precios />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App
