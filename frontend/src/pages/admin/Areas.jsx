import React, { useState, useEffect } from "react";
import "../../styles/Admin/Teams.css";
import AreaCard from "../../components/admin/AreaCard.jsx";
import { CirclePlus } from "lucide-react";
import ModalNuevaArea from "../../components/admin/NewTeamsModal.jsx";
import useDataTeams from "../../hooks/admin/useDataTeams.jsx";
import UpdateTeams from "../../components/admin/UpdateTeams.jsx"; 

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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              width: "auto",
              marginLeft: "3rem",
            }}
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
                <AreaCard
                  key={area._id}
                  name={area.name}
                  onClick={() => {
                    setSelectedArea(area);
                    setShowEditModal(true);
                  }}
                />
              )}
            />
          ) : (
            <p style={{ padding: "20px", color: "#888" }}>
              No se encontraron áreas.
            </p>
          )}
        </div>
      </div>

      {/* Modal para agregar área */}
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

      {/* Modal para editar/eliminar área */}
      {showEditModal && selectedArea && (
        <div
          className={`employee-modal-overlay active`}
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