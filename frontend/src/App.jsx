import React from 'react';
import { AuthProvider } from './context/AuthProvider'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage/LoginPage';
import Home from '../src/pages/Home'

function App() {
  return (
    <AuthProvider> {}
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          {}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

