import './LoginPage.css'
import LogoRedondo from '../../img/logo_redondo.png'

export const LoginPage = () => {
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

        <form className="login-form">
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
            />
          </div>

          <button type="submit" className="login-button">
            <b>Iniciar sesión</b>
          </button>
        </form>

        <div className="footer">
          <b>
            <p>Desarrollado por el departamento de Desarrollo de Software</p>
          </b>
          <b>
            <p>
              del{" "}
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
