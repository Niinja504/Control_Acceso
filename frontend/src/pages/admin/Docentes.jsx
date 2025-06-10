import React, { useState, useMemo } from "react";
import "../../styles/Admin/Docentes.css";
import DocenteCard from "../../components/admin/DocenteCard.jsx";
import { Search, CirclePlus } from "lucide-react";

const GestionDeDocentes = () => {
  const [searchTerm, setSearchTerm] = useState("");

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

          <button className="nuevo-docente-btn">
            <CirclePlus size={20} />
            Nuevo docente
          </button>
        </div>
      </div>

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

export default GestionDeDocentes;
