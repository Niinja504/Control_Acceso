import React, { useState, useMemo, useEffect } from "react";
import "../../styles/Admin/Docentes.css";
import DocenteCard from "../../components/admin/DocenteCard.jsx";
import { Search, CirclePlus } from "lucide-react";
import NewPersonalCard from "../../components/admin/NewTeachersModal.jsx";
import UpdateTeachers from "../../components/admin/UpdateTeachers.jsx";
import useEmployees from "../../hookS/admin/useDataEmployee.jsx";
import useTeams from "../../hookS/admin/useDataTeams.jsx";

const AREAS_FILTRADAS = [
  "684c55f1f9250ad01c4d5ee9",
  "684c55f1f9250ad01c4d5ee8",
  "684c55f1f9250ad01c4d5ee6",
  "684c55f1f9250ad01c4d5ee7",
  "684c55f1f9250ad01c4d5eea",
];

const Docentes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewDocente, setShowNewDocente] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [docenteEdit, setDocenteEdit] = useState(null);

  const { employees, fetchEmployees, saveEmployee, deleteEmployee } = useEmployees();
  const { teams, fetchTeams } = useTeams();

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const filteredAreas = useMemo(() => {
    return teams.filter((team) => AREAS_FILTRADAS.includes(team._id));
  }, [teams]);

  const filteredDocentes = useMemo(() => {
    return employees.filter((docente) => {
      const fullName = `${docente.names} ${docente.surnames}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      let matchesArea = true;
      if (selectedArea === "") {
        matchesArea =
          AREAS_FILTRADAS.includes(docente.IdTeam) ||
          AREAS_FILTRADAS.includes(docente.IdTeam?._id);
      } else {
        matchesArea =
          docente.IdTeam === selectedArea ||
          docente.IdTeam?._id === selectedArea;
      }
      return matchesSearch && matchesArea;
    });
  }, [searchTerm, selectedArea, employees]);

  return (
    <>
      <div
        className="encabezado"
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <h1 className="titulo">Gestión de docentes</h1>
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
            className="nuevo-docente-btn"
            onClick={() => setShowNewDocente(true)}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <CirclePlus size={20} />
            Nuevo docente
          </button>
        </div>
      </div>

      <div className="gestion-de-docentes">
        <div
          className="docentes-list"
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
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontSize: "16px",
              minWidth: "180px",
              alignSelf: "flex-start",
              marginBottom: "10px",
            }}
          >
            <option value="">Todas las áreas</option>
            {filteredAreas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>

          {filteredDocentes.length > 0 ? (
            filteredDocentes.map((docente) => (
              <div key={docente._id} onClick={() => setDocenteEdit(docente)} style={{ cursor: "pointer" }}>
                <DocenteCard
                  status={docente.status}
                  name={docente.names}
                  surnames={docente.surnames}
                />
              </div>
            ))
          ) : (
            <p style={{ padding: "20px", color: "#888" }}>
              No se encontraron docentes.
            </p>
          )}
        </div>
      </div>

      {}
      {showNewDocente && (
        <div className="modal-overlay active" onClick={() => setShowNewDocente(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "none", boxShadow: "none", padding: 0 }}
          >
            <NewPersonalCard
              tipo="docente"
              onSaved={() => {
                fetchEmployees();
                setShowNewDocente(false);
              }}
              onClose={() => setShowNewDocente(false)}
            />
          </div>
        </div>
      )}

      {}
      {docenteEdit && (
        <UpdateTeachers
          empleado={docenteEdit}
          onSave={async (data, id) => {
            await saveEmployee(data, id);
            setDocenteEdit(null);
            fetchEmployees();
          }}
          onDelete={async (id) => {
            await deleteEmployee(id);
            setDocenteEdit(null);
            fetchEmployees();
          }}
          onClose={() => setDocenteEdit(null)}
        />
      )}
    </>
  );
};

export default Docentes;