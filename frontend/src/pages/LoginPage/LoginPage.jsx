import React, { useState } from "react";
import { Global } from "../../helpers/Global";
import Swal from "sweetalert2";
import './LoginPage.css';
import LogoRedondo from '../../img/logo_redondo.png';
import { useForm } from "../../hooks/useForm";

export const LoginPage = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const loginUser = async (e) => {
    e.preventDefault();
    let userToLogin = form;

    try {
      const request = await fetch(Global.url + "login", {
        method: "POST",
        body: JSON.stringify(userToLogin),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });

      const data = await request.json();

      if (data.status === "success") {
        setSaved("login");
        setAuth({
          userId: data.user.userId,
          userType: data.user.userType,
          email: data.user.email
        });

        Swal.fire({
          title: "¡Inicio de Sesión exitoso!",
          text: "Serás redirigido en breve",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/home");
        });
      } else {
        setSaved("error");
        Swal.fire({
          title: "Error",
          text: data.message || "Credenciales incorrectas",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      setSaved("error");
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al intentar iniciar sesión",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
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

        <form className="login-form" onSubmit={loginUser}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Correo electrónico institucional
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              onChange={changed}
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
              onChange={changed}
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
