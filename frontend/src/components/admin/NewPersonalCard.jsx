import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CardNewclient.css";

export default function NewPersonalCard() {
  const [form, setForm] = useState({
    numEmpleado: "",
    names: "",
    surnames: "",
    DUI: "",
    birthday: "",
    telephone: "",
    email: "",
    password: "",
    hireDate: "",
    IdTeam: "",
    status: true,
    address: "",
  });

  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Cargar equipos desde el backend
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/teams"); // Ajusta la URL si es necesario
        setTeams(res.data);
      } catch (error) {
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "select-one" && name === "status") {
      setForm({ ...form, [name]: value === "activo" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/employees", form); // Ajusta la URL si es necesario
      alert("Docente guardado correctamente");
      // Limpia el formulario si lo deseas
      setForm({
        numEmpleado: "",
        names: "",
        surnames: "",
        DUI: "",
        birthday: "",
        telephone: "",
        email: "",
        password: "",
        hireDate: "",
        IdTeam: "",
        status: true,
        address: "",
      });
    } catch (error) {
      alert("Error al guardar el docente");
    }
  };

  return (
    <form className="new-docente-form" onSubmit={handleSubmit}>
      <h2>Crea un nuevo docente</h2>

      <div className="form-field">
        <label htmlFor="numEmpleado">Código de empleado:</label>
        <input
          id="numEmpleado"
          name="numEmpleado"
          type="text"
          value={form.numEmpleado}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="names">Nombres:</label>
        <input
          id="names"
          name="names"
          type="text"
          value={form.names}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="surnames">Apellidos:</label>
        <input
          id="surnames"
          name="surnames"
          type="text"
          value={form.surnames}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="DUI">DUI:</label>
        <input
          id="DUI"
          name="DUI"
          type="text"
          value={form.DUI}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="birthday">Fecha de nacimiento:</label>
        <input
          id="birthday"
          name="birthday"
          type="date"
          value={form.birthday}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="telephone">Número telefónico:</label>
        <input
          id="telephone"
          name="telephone"
          type="text"
          value={form.telephone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">Correo electrónico:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="usuario@ricaldone.edu.sv"
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="hireDate">Fecha de contratación:</label>
        <input
          id="hireDate"
          name="hireDate"
          type="date"
          value={form.hireDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="IdTeam">Equipo:</label>
        <select
          id="IdTeam"
          name="IdTeam"
          value={form.IdTeam}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un equipo</option>
          {loadingTeams ? (
            <option disabled>Cargando equipos...</option>
          ) : (
            teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="status">Estado:</label>
        <select
          id="status"
          name="status"
          value={form.status ? "activo" : "inactivo"}
          onChange={handleChange}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="address">Dirección de residencia:</label>
        <input
          id="address"
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn-guardar">
        GUARDAR
      </button>
    </form>
  );
}