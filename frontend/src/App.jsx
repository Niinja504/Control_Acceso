import React from 'react';
//import { AuthProvider } from './context/AuthProvider'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
      <Router>
        <Routes>
          {/* Redirigir a /login si se accede a la raíz */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

  );
}

export default App;

