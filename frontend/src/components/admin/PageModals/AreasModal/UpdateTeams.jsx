import React, { useState } from "react";
import useDataTeams from "../../../../hooks/admin/useDataTeams.jsx";
import "../../../../components/styles/ModalUpdateTeams.css";

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
    <div className="card-teams-modal">
      <div className="card-teams-header">
        <div className="card-teams-title">Editar área</div>
      </div>
      <form onSubmit={handleUpdate} className="card-teams-form">
        <div className="card-teams-group">
          <label className="card-teams-label">Nombre</label>
          <input
            className="card-teams-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="card-teams-actions">
          <button type="submit" className="card-teams-btn success">
            Actualizar
          </button>
          <button
            type="button"
            className="card-teams-btn danger"
            onClick={handleDelete}
          >
            Eliminar
          </button>
          <button
            type="button"
            className="card-teams-btn neutral"
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
