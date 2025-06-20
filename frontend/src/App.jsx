import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthForm, useAuth } from './AuthProvider';
import Dashboard from './Dashboard';
import Home from './Home';
import Precios from './Precios';
import Chatbot from './Chatbot';
import Navigation from './Navigation';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return currentUser ? children : <Navigate to="/login" />;
};

// Componente principal de la aplicación
const AppContent = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="App">
        {currentUser && <Navigation />}

        <Routes>
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/dashboard" /> : <AuthForm />}
          />
          <Route
            path="/"
            element={currentUser ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route
            path="/precios"
            element={<Precios />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

// Componente App principal
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
