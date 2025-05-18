import './LoginPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import LogoRedondo from '../../img/logo_redondo.png';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const navigate = useNavigate(); // Hook para redirección

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mostrar indicador de carga
    try {
      console.log("Datos recibidos:", { email, password });
      const response = await fetch(`http://localhost:4000/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        // Manejo de errores HTTP
        throw new Error('Error en la solicitud. Verifica tus credenciales.');
      }

      const data = await response.json();

      if (data.message === 'login successful') {
        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: 'Redirigiendo al portal...',
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => navigate('/home'), 2000); // Redirigir después de 1.5 segundos
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'Por favor, verifica tu correo y contraseña.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Ocurrió un error. Inténtalo de nuevo más tarde.',
      });
    } finally {
      setLoading(false); // Ocultar indicador de carga
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img
            src={LogoRedondo}
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

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Correo electrónico institucional
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Contraseña"
              className="input-field"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : <b>Iniciar sesión</b>}
          </button>
        </form>

        <div className="footer">
          <b>
            <p>Desarrollado por el departamento de Desarrollo de Software</p>
          </b>
          <b>
            <p>
              del{' '}
              <a href="https://www.ricaldone.edu.sv/" className="highlight">
                Instituto Técnico Ricaldone
              </a>
            </p>
          </b>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
