import React, { useState, useMemo, useEffect } from "react";
import "../../styles/Admin/Coordinators.css";
import DocenteCard from "../../components/admin/DocenteCard.jsx";
import { Search, CirclePlus } from "lucide-react";
import ModalCoordinators from "../../components/admin/NewCoordinatorsModal.jsx";
import UpdateCoordinators from "../../components/admin/UpdateCoordinators.jsx";
import useCoordinators from "../../hookS/admin/useDataCoordinators.jsx";

const Coordinadores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCoordinador, setShowNewCoordinador] = useState(false);
  const [coordinadorEdit, setCoordinadorEdit] = useState(null);

  const {
    coordinators,
    fetchCoordinators,
    saveCoordinator,
    deleteCoordinator,
  } = useCoordinators();

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const filteredCoordinadores = useMemo(() => {
    return coordinators.filter((coordinador) => {
      const fullName = `${coordinador.names} ${coordinador.surnames}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, coordinators]);

  return (
    <>
      <div
        className="encabezado"
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <h1 className="titulo">Gestión de coordinadores</h1>
        <div
          className="busqueda-bar"
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <div className="buscador" style={{ flexGrow: 1 }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombres y apellidos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <button
            className="nuevo-coordinador-btn"
            onClick={() => setShowNewCoordinador(true)}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <CirclePlus size={20} />
            Nuevo coordinador
          </button>
        </div>
      </div>

      <div className="gestion-de-coordinadores">
        <div
          className="coordinadores-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "10px",
            justifyContent: "flex-start",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "10px",
            maxHeight: "630px",
            overflowY: "auto",
            backgroundColor: "#ffffff",
          }}
        >
          {filteredCoordinadores.length > 0 ? (
            filteredCoordinadores.map((coordinador) => (
              <div
                key={coordinador._id}
                onClick={() => setCoordinadorEdit(coordinador)}
                style={{ cursor: "pointer" }}
              >
                <DocenteCard
                  status={coordinador.status}
                  name={coordinador.names}
                  surnames={coordinador.surnames}
                  photo={coordinador.photo}
                />
              </div>
            ))
          ) : (
            <p style={{ padding: "20px", color: "#888" }}>
              No se encontraron coordinadores.
            </p>
          )}
        </div>
      </div>

      {showNewCoordinador && (
        <div className="modal-overlay active" onClick={() => setShowNewCoordinador(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "none", boxShadow: "none", padding: 0 }}
          >
            <ModalCoordinators
              onSaved={() => {
                fetchCoordinators();
                setShowNewCoordinador(false);
              }}
              onClose={() => setShowNewCoordinador(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para editar/eliminar coordinador */}
      {coordinadorEdit && (
        <UpdateCoordinators
          admin={coordinadorEdit}
          onSave={async (data, id) => {
            await saveCoordinator(data, id);
            setCoordinadorEdit(null);
            fetchCoordinators();
          }}
          onDelete={async (id) => {
            await deleteCoordinator(id);
            setCoordinadorEdit(null);
            fetchCoordinators();
          }}
          onClose={() => setCoordinadorEdit(null)}
        />
      )}
    </>
  );
};

export default Coordinadores;