import { useState } from 'react';
import './LoginPage.css'; // Import the CSS file

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('Login attempt with:', { email, password });
    // Here you would handle authentication
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img 
            src="/path-to-your-logo.png" 
            alt="Instituto Técnico Ricaldone Logo" 
            className="logo" 
          />
          <h1 className="title">
            Bienvenido al<br />
            Portal Estudiantil ITR
          </h1>
        </div>
        
        <p className="subtitle">
          Ingresa tus credenciales para acceder al sistema
        </p>
        
        <div>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Correo electrónico institucional
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            className="login-button"
          >
            Iniciar sesión
          </button>
        </div>
        
        <div className="footer">
          <p>Desarrollado por el departamento de Desarrollo de Software</p>
          <p>del <span className="highlight">Instituto Técnico Ricaldone</span></p>
        </div>
      </div>
    </div>
  );
}