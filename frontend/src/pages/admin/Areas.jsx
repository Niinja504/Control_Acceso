import React, { useState, useEffect } from "react";
import "../../styles/Admin/Teams.css";
import AreaCard from "../../components/admin/AreaCard.jsx";
import { CirclePlus } from "lucide-react";
import ModalNuevaArea from "../../components/admin/NewTeamsModal.jsx";
import useDataTeams from "../../hooks/admin/useDataTeams.jsx";
import UpdateTeams from "../../components/admin/UpdateTeams.jsx";

const Areas = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const { teams, fetchTeams } = useDataTeams();

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
      <div className="encabezado">
        <h1 className="titulo">Gestión de áreas</h1>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button
            className="nuevo-empleado-btn"
            onClick={() => setShowModal(true)}
          >
            <CirclePlus size={20} />
            Agregar área
          </button>
        </div>
      </div>

      <div className="gestion-de-empleados">
        <div className="empleados-list" style={{ minHeight: "200px" }}>
          {teams.length > 0 ? (
            <div className="area-row">
              {teams.map((area) => (
                <AreaCard
                  key={area._id}
                  name={area.name}
                  onClick={() => {
                    setSelectedArea(area);
                    setShowEditModal(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <p style={{ padding: "20px", color: "#888" }}>
              No se encontraron áreas.
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="employee-modal-overlay active"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "none", boxShadow: "none", padding: 0 }}
          >
            <ModalNuevaArea
              onSaved={() => {
                fetchTeams();
                setShowModal(false);
              }}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {showEditModal && selectedArea && (
        <div
          className="employee-modal-overlay active"
          onClick={() => {
            setShowEditModal(false);
            setSelectedArea(null);
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "none", boxShadow: "none", padding: 0 }}
          >
            <UpdateTeams
              area={selectedArea}
              onClose={() => {
                setShowEditModal(false);
                setSelectedArea(null);
                fetchTeams();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Areas;