import React from "react";
import "../styles/docenteCard.css";
import Icon from "../../assets/icon.jpg";

const DocenteCard = ({ status, name, surnames }) => {
  return (
    <div className="docente-card">
      <div className={`status-indicator ${status ? "online" : "offline"}`}></div>
      <img src={Icon} alt="Avatar" className="docente-avatar" />
      <p className="docente-nombre">
        Nombre: <span className="bold">{name} {surnames}</span>
      </p>
    </div>
  );
};

export default DocenteCard;
