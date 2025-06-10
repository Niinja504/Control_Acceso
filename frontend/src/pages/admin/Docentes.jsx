import React from "react";
import "../../styles/Admin/Docentes.css";
import DocenteCard from "../../components/admin/DocenteCard.jsx";

const GestionDeDocentes = () => {
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


  return (
    <div className="gestion-de-docentes">
      <h1 className="text-wrapper-2">Gestión de Docentes</h1>

      <div className="busqueda-bar">
        <img src="/busqueda1.png" alt="Buscar" />
        <input type="text" placeholder="Buscar por nombres y apellidos" />
        <button className="nuevo-docente-btn">
          <img src="/agregar1.png" alt="Agregar" />
          Nuevo docente
        </button>
      </div>

      

      <div className="docentes-list">
        <p className="Texto">Docentes académicos</p>
        {docentes.map((docente, index) => (
          <DocenteCard
            key={index}
            status={docente.status}
            name={docente.name}
            surnames={docente.surnames}
          />
        ))}
      </div>
    </div>
  );
};

export default GestionDeDocentes;
