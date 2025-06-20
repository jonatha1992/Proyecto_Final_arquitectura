import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import AuthDemo from './AuthDemo';
import Turnos from './Turnos';
import Precios from './Precios';
import Chatbot from './Chatbot';
function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <AuthDemo onAuth={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/turnos" element={user ? <Turnos /> : <p>Inicia sesión para ver tus turnos.</p>} />
        <Route path="/precios" element={<Precios />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}
export default App
