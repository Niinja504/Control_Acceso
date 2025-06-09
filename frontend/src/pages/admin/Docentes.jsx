import React from "react";
import "../../styles/Admin/Docentes.css";

const GestionDeDocentes = () => {
  return (
    <div className="gestion-de-docentes">
        <div className="overlap-group">
          <img className="busqueda" alt="Búsqueda" src="busqueda1.png" />
          <p className="text-wrapper">Buscar por nombres y apellidos</p>
        </div>

        <h1 className="text-wrapper-2">Gestión de Docentes</h1>

        <div className="overlap-group-2">
          <div className="overlap-2">
            <div className="rectangle" />
            <p className="nombre-ruth">
              <span className="span">Nombre</span>
              <span className="text-wrapper-6">: </span>
              <span className="text-wrapper-7">Ruth Geraldine Fuentes Ramirez</span>
            </p>
            <p className="nombre-emilia">
              <span className="span">Nombre</span>
              <span className="text-wrapper-6">: </span>
              <span className="text-wrapper-7">Emilia Fernanda Fuentes Ramirez</span>
            </p>
          </div>
          <p className="text-wrapper-11">Docentes académicos</p>
        </div>

        <div className="overlap-3">
          <img className="agregar" alt="Agregar" src="agregar1.png" />
          <p className="text-wrapper-12">Nuevo docente</p>
        </div>
      </div>
  );
};

export default GestionDeDocentes;