import React, { useState, useEffect } from "react";
import "../../styles/Admin/Teams.css";
import AreaCard from "../../components/admin/AreaCard.jsx";
import { CirclePlus } from "lucide-react";
import ModalNuevaArea from "../../components/admin/NewTeamsModal.jsx";
import useDataTeams from "../../hooks/admin/useDataTeams.jsx";

const AgruparEnFilas = ({ items, porFila, renderItem }) => {
  const filas = [];
  for (let i = 0; i < items.length; i += porFila) {
    filas.push(items.slice(i, i + porFila));
  }
  return (
    <>
      {filas.map((fila, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {fila.map(renderItem)}
        </div>
      ))}
    </>
  );
};

const Teams = () => {
  const [showModal, setShowModal] = useState(false);
  const { teams, fetchTeams } = useDataTeams();

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
      <div className="encabezado" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <h1 className="titulo">Gestión de áreas</h1>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="nuevo-empleado-btn"
            onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "5px", width: "auto" }}
          >
            <CirclePlus size={20} />
            Agregar área
          </button>
        </div>
      </div>

      <div className="gestion-de-empleados">
        <div className="empleados-list" style={{ minHeight: "200px" }}>
          {teams.length > 0 ? (
            <AgruparEnFilas
              items={teams}
              porFila={4}
              renderItem={(area) => (
                <AreaCard key={area._id} name={area.name} />
              )}
            />
          ) : (
            <p style={{ padding: "20px", color: "#888" }}>
              No se encontraron áreas.
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className={`employee-modal-overlay active`}
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
    </>
  );
};

export default Teams;