import React, { useState } from "react";
import useDataTeams from "../../hooks/admin/useDataTeams.jsx";
import "../../components/styles/ModalUpdateTeams.css";

const UpdateTeams = ({ area, onClose }) => {
  const [name, setName] = useState(area.name);
  const { saveTeam, eliminarTeam } = useDataTeams();

  const handleUpdate = async (e) => {
    e.preventDefault();
    await saveTeam({ name, _id: area._id });
    onClose();
  };

  const handleDelete = async () => {
    await eliminarTeam(area._id);
    onClose();
  };

  return (
    <div className="cvcard-modal">
      <div className="cvcard-header">
        <div className="cvcard-nombre">Editar área</div>
      </div>
      <form onSubmit={handleUpdate} className="cvcard-info">
        <div className="cvcard-info-group">
          <label className="cvcard-label">Nombre</label>
          <input
            className="cvcard-value"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              fontSize: "16px",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "4px",
            }}
            required
          />
        </div>
        <div className="cvcard-actions" style={{ marginTop: "18px" }}>
          <button
            type="submit"
            className="cvcard-action-btn"
            style={{ background: "#4caf50", color: "#fff" }}
          >
            Actualizar
          </button>
          <button
            type="button"
            className="cvcard-action-btn"
            style={{ background: "#f44336", color: "#fff" }}
            onClick={handleDelete}
          >
            Eliminar
          </button>
          <button
            type="button"
            className="cvcard-action-btn"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTeams;