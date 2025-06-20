import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../components/styles/ModalNewTeams.css";

export default function ModalNuevaArea({ onSaved, onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      return Swal.fire("Nombre inválido", "El nombre debe tener al menos 3 caracteres.", "warning");
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:4000/api/teams", { name });
      await Swal.fire("¡Guardado!", "El área ha sido registrada exitosamente.", "success");
      setName("");
      if (onSaved) onSaved();
      if (onClose) onClose();
    } catch (error) {
      await Swal.fire(
        "Error al guardar",
        error.response?.data?.message || "Verifica que los campos estén correctos.",
        "error"
      );
    } finally {
      setLoading(false);
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
      <h2>Crear nueva área</h2>
      <div className="form-field">
        <label htmlFor="area-name">Nombre del área:</label>
        <input
          id="area-name"
          name="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          minLength={3}
          maxLength={100}
          placeholder="Área"
        />
      </div>
      <button type="submit" className="btn-guardar" disabled={loading}>
        {loading ? "Guardando..." : "GUARDAR"}
      </button>
    </form>
  );
}