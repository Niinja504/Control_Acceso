import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/CardNewclient.css";

// Convertir fechas a formato YYYY-MM-DD
const toInputDateFormat = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

export default function NewPersonalCard({ onSaved, onClose, tipo = "docente" }) {
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

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/teams");
        const targetAreas = [
          "Área Académica",
          "Área Técnica",
          "Área de Escuela de Idiomas",
          "Área de CFP"
        ];

        const filteredTeams = res.data.filter((team) =>
          targetAreas.includes(team.name)
        );

        setTeams(filteredTeams);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
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

  const handleDUIChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length > 9) value = value.slice(0, 9); // Máximo 9 dígitos
    if (value.length > 8) {
      value = value.slice(0, 8) + "-" + value.slice(8);
    }
    setForm({ ...form, DUI: value });
  };

  // Nuevo handler para el teléfono
  const handleTelephoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length > 8) value = value.slice(0, 8); // Máximo 8 dígitos
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }
    setForm({ ...form, telephone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación extra opcional (correo termina en @ricaldone.edu.sv)
    if (!form.email.toLowerCase().endsWith("@ricaldone.edu.sv")) {
      return Swal.fire(
        "Correo inválido",
        "El correo debe terminar en @ricaldone.edu.sv",
        "warning"
      );
    }

    const dataToSend = {
      ...form,
      birthday: toInputDateFormat(form.birthday),
      hireDate: toInputDateFormat(form.hireDate),
    };

    try {
      // CORRECCIÓN: URL singular /api/employee
      await axios.post("http://localhost:4000/api/employee", dataToSend);
      await Swal.fire(
        "¡Guardado!",
        tipo === "docente"
          ? "El docente ha sido registrado exitosamente."
          : "El empleado ha sido registrado exitosamente.",
        "success"
      );
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
      onSaved(); // Notificar al padre que se guardó
      if (onClose) onClose();
    } catch (error) {
      console.error(
        "Error al guardar:",
        error.response?.data || error.message
      );
      await Swal.fire(
        "Error al guardar",
        error.response?.data?.message ||
          "Verifica que los campos estén correctos.",
        "error"
      );
    }
  };

  return (
    <form className="new-docente-form" onSubmit={handleSubmit}>
      <button
        type="button"
        className="close-modal"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>
      <h2>
        {tipo === "docente" ? "Crear un nuevo docente" : "Crear un nuevo empleado"}
      </h2>

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
          onChange={handleDUIChange}
          required
          maxLength={10}
          pattern="\d{8}-\d{1}"
          title="El formato debe ser 12345678-9"
          placeholder="12345678-9"
        />
      </div>

      <div className="form-field">
        <label htmlFor="birthday">Fecha de nacimiento:</label>
        <input
          id="birthday"
          name="birthday"
          type="date"
          value={toInputDateFormat(form.birthday)}
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
          onChange={handleTelephoneChange}
          required
          maxLength={9}
          pattern="\d{4}-\d{4}"
          title="El formato debe ser 1234-5678"
          placeholder="1234-5678"
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
          value={toInputDateFormat(form.hireDate)}
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