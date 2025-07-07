import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Camera } from "lucide-react";
import "../styles/Modal.css";

// Convertir fechas a formato YYYY-MM-DD
const toInputDateFormat = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

export default function NewCoordinatorsModal({ onSaved, onClose }) {
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
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/teams");
        setTeams(res.data);
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
    } else if (name === "IdTeam") {
      setForm({ ...form, [name]: String(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDUIChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length > 8) {
      value = value.slice(0, 8) + "-" + value.slice(8);
    }
    setForm({ ...form, DUI: value });
  };

  const handleTelephoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }
    setForm({ ...form, telephone: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.toLowerCase().endsWith("@ricaldone.edu.sv")) {
      return Swal.fire(
        "Correo inválido",
        "El correo debe terminar en @ricaldone.edu.sv",
        "warning"
      );
    }

    if (!form.IdTeam || form.IdTeam === "") {
      return Swal.fire(
        "Equipo requerido",
        "Debes seleccionar un equipo válido.",
        "warning"
      );
    }

    const dataToSend = new FormData();
    Object.entries({
      ...form,
      birthday: toInputDateFormat(form.birthday),
      hireDate: toInputDateFormat(form.hireDate),
      IdTeam: String(form.IdTeam),
    }).forEach(([key, value]) => dataToSend.append(key, value));

    if (image) {
      dataToSend.append("photo", image);
    }

    try {
      setUploading(true);
      await axios.post("http://localhost:4000/api/registerCoordinators", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await Swal.fire(
        "¡Guardado!",
        "El coordinador ha sido registrado exitosamente.",
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
      setImage(null);
      setPreviewUrl(null);
      // Cambios aquí: espera a que onSaved termine si es una promesa
      if (onSaved) {
        const result = onSaved();
        if (result instanceof Promise) {
          await result;
        }
      }
      if (onClose) onClose();
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error.message);
      await Swal.fire(
        "Error al guardar",
        error.response?.data?.message || "Verifica que los campos estén correctos.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="new-coordinador-form" onSubmit={handleSubmit}>
      <button
        type="button"
        className="close-modal"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>
      <h2>Crear un nuevo coordinador</h2>

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

      <div className="form-field">
        <label htmlFor="photo">Imagen:</label>
        <div className="image-upload-container">
          <label htmlFor="photo" className="custom-image-upload" style={{ cursor: "pointer", padding: "0", border: "none", background: "none" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#f5f6fa",
              border: "1.5px dashed #bfc2cc",
              borderRadius: "12px",
              padding: "10px 18px",
              transition: "border-color 0.2s",
              fontSize: "15px",
              color: "#4a4a4a",
              fontWeight: 500,
              width: "fit-content"
            }}>
              <Camera className="camera-icon" style={{ fontSize: 26, color: "#4a90e2" }} />
              <span>{image ? "Cambiar imagen" : "Agregar imagen"}</span>
            </div>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
          <div className="image-preview-area">
            {uploading ? (
              <div className="image-uploading-spinner"></div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="image-preview"
              />
            ) : (
              <div className="image-placeholder">Sin imagen</div>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="btn-guardar" disabled={uploading}>
        {uploading ? "Subiendo..." : "GUARDAR"}
      </button>
    </form>
  );
}