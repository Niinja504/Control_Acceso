import React, { useState, useMemo, useEffect } from "react";
import "../../styles/Admin/Empleados.css";
import EmpleadoCard from "../../components/admin/DocenteCard.jsx";
import { Search, CirclePlus } from "lucide-react";
import ModalEmpleado from "../../components/admin/NewEmpleadosModal.jsx";
import EditEmpleadoModal from "../../components/admin/UpdateEmpleaods.jsx";
import useEmployees from "../../hooks/admin/useDataEmployee.jsx";
import useTeams from "../../hooks/admin/useDataTeams.jsx";

const AREAS_FILTRADAS = [
  "684c55f1f9250ad01c4d5ee3",
  "684c55f1f9250ad01c4d5ee4",
  "684c55f1f9250ad01c4d5eed",
  "684c55f1f9250ad01c4d5ee5",
  "684c55f1f9250ad01c4d5eeb",
  "684c55f1f9250ad01c4d5ee2",
  "684c55f1f9250ad01c4d5eec",
  "684c55f1f9250ad01c4d5eee",
];

const Empleados = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewEmpleado, setShowNewEmpleado] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  const { employees, fetchEmployees, saveEmployee, deleteEmployee } =
    useEmployees();
  const { teams, fetchTeams } = useTeams();

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const filteredAreas = useMemo(() => {
    return teams.filter((team) => AREAS_FILTRADAS.includes(team._id));
  }, [teams]);

  const filteredEmpleados = useMemo(() => {
    return employees.filter((empleado) => {
      const fullName = `${empleado.names} ${empleado.surnames}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      let matchesArea = true;
      if (selectedArea === "") {
        matchesArea =
          AREAS_FILTRADAS.includes(empleado.IdTeam) ||
          AREAS_FILTRADAS.includes(empleado.IdTeam?._id);
      } else {
        matchesArea =
          empleado.IdTeam === selectedArea ||
          empleado.IdTeam?._id === selectedArea;
      }
      return matchesSearch && matchesArea;
    });
  }, [searchTerm, selectedArea, employees]);

  // Guardar (crear o actualizar)
  const handleSave = async (data, id) => {
    await saveEmployee(data, id);
    setSelectedEmpleado(null);
    fetchEmployees();
  };

  // Eliminar empleado
  const handleDelete = async (id) => {
    await deleteEmployee(id);
    setSelectedEmpleado(null);
    fetchEmployees();
  };

  return (
    <>
      <div
        className="encabezado"
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <h1 className="titulo">Gestión de empleados</h1>
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
            className="nuevo-empleado-btn"
            onClick={() => setShowNewEmpleado(true)}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <CirclePlus size={20} />
            Nuevo empleado
          </button>
        </div>
      </div>

      <div className="gestion-de-empleados">
        <div
          className="empleados-list"
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

          {filteredEmpleados.length > 0 ? (
            filteredEmpleados.map((empleado) => (
              <EmpleadoCard
                key={empleado._id}
                status={empleado.status}
                name={empleado.names}
                surnames={empleado.surnames}
                onClick={() => setSelectedEmpleado(empleado)}
              />
            ))
          ) : (
            <p style={{ padding: "20px", color: "#888" }}>
              No se encontraron empleados.
            </p>
          )}
        </div>
      </div>

      {showNewEmpleado && (
        <div
          className={`employee-modal-overlay ${
            showNewEmpleado ? "active" : ""
          }`}
          onClick={() => setShowNewEmpleado(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "none", boxShadow: "none", padding: 0 }}
          >
            <ModalEmpleado
              tipo="empleado"
              onSaved={() => {
                fetchEmployees();
                setShowNewEmpleado(false);
              }}
              onClose={() => setShowNewEmpleado(false)}
            />
          </div>
        </div>
      )}

      {selectedEmpleado && (
        <EditEmpleadoModal
          empleado={selectedEmpleado}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setSelectedEmpleado(null)}
        />
      )}
    </>
  );
};

export default Empleados;