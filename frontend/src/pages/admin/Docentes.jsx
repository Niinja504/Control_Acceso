import React, { useState, useMemo } from "react";
import "../../styles/Admin/Docentes.css";
import DocenteCard from "../../components/admin/DocenteCard.jsx";
import { Search, CirclePlus } from "lucide-react";
import NewPersonalCard from "../../components/admin/NewPersonalCard.jsx"; // Importación corregida

const Docentes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewDocente, setShowNewDocente] = useState(false); // Estado para mostrar el modal

  const docentes = [
    { status: true, name: "Ruth Geraldine", surnames: "Fuentes Ramirez" },
    { status: false, name: "Emilia Fernanda", surnames: "Fuentes Ramirez" },
    { status: true, name: "Juan Carlos", surnames: "Martínez López" },
    { status: false, name: "Laura Vanessa", surnames: "González Chávez" },
    { status: true, name: "Pedro Andrés", surnames: "Zapata Mendoza" },
    { status: false, name: "María José", surnames: "Serrano Rivera" },
    { status: true, name: "César Augusto", surnames: "Torres León" },
    { status: false, name: "Diana Carolina", surnames: "Rivas Salazar" },
    { status: true, name: "Andrés Felipe", surnames: "Cortés Moreno" },
    { status: false, name: "Valeria Sofía", surnames: "Ramírez Delgado" },
  ];

  const filteredDocentes = useMemo(() => {
    return docentes.filter((docente) =>
      `${docente.name} ${docente.surnames}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, docentes]);

  return (
    <>
      <div className="encabezado">
        <h1 className="titulo">Gestión de docentes</h1>
        <div className="busqueda-bar">
          <div className="buscador">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombres y apellidos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="nuevo-docente-btn"
            onClick={() => setShowNewDocente(true)}
          >
            <CirclePlus size={20} />
            Nuevo docente
          </button>
        </div>
      </div>

      {/* Modal para Nuevo Docente */}
      {showNewDocente && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowNewDocente(false)}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
              position: "relative",
              minWidth: "300px",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="close-modal"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
              onClick={() => setShowNewDocente(false)}
            >
              ×
            </button>
            <NewPersonalCard />
          </div>
        </div>
      )}

      <div className="gestion-de-docentes">
        <div className="docentes-list">
          <p className="Texto">Docentes académicos</p>
          {filteredDocentes.length > 0 ? (
            filteredDocentes.map((docente, index) => (
              <DocenteCard
                key={index}
                status={docente.status}
                name={docente.name}
                surnames={docente.surnames}
              />
            ))
          ) : (
            <p style={{ padding: "20px", color: "#888" }}>
              No se encontraron docentes.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Docentes;