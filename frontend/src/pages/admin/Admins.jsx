import React, { useState, useMemo, useEffect } from "react";
import "../../styles/Admin/Admins.css";
import DocenteCard from "../../components/admin/DocenteCard.jsx";
import { Search, CirclePlus } from "lucide-react";
import ModalAdmin from "../../components/admin/NewAdminModal.jsx";
import UpdateAdmins from "../../components/admin/UpdateAdmins.jsx";
import useAdmins from "../../hookS/admin/useDataAdmin.jsx";

const Admins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewAdmin, setShowNewAdmin] = useState(false);
  const [adminEdit, setAdminEdit] = useState(null);

  const { admins, fetchAdmins, saveAdmin, deleteAdmin } = useAdmins();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const fullName = `${admin.names} ${admin.surnames}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, admins]);

  return (
    <>
      <div
        className="encabezado"
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <h1 className="titulo">Gestión de administradores</h1>
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
            onClick={() => setShowNewAdmin(true)}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <CirclePlus size={20} />
            Nuevo administrador
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
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin) => (
              <div key={admin._id} onClick={() => setAdminEdit(admin)} style={{ cursor: "pointer" }}>
                <DocenteCard
                  status={admin.status}
                  name={admin.names}
                  surnames={admin.surnames}
                />
              </div>
            ))
          ) : (
            <p style={{ padding: "20px", color: "#888" }}>
              No se encontraron administradores.
            </p>
          )}
        </div>
      </div>

      {/* Modal para crear nuevo admin */}
      {showNewAdmin && (
        <div className="modal-overlay active" onClick={() => setShowNewAdmin(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "none", boxShadow: "none", padding: 0 }}
          >
            <ModalAdmin
              tipo="admin"
              onSaved={() => {
                fetchAdmins();
                setShowNewAdmin(false);
              }}
              onClose={() => setShowNewAdmin(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para editar/eliminar admin */}
      {adminEdit && (
        <UpdateAdmins
          admin={adminEdit}
          onSave={async (data, id) => {
            await saveAdmin(data, id);
            setAdminEdit(null);
            fetchAdmins();
          }}
          onDelete={async (id) => {
            await deleteAdmin(id);
            setAdminEdit(null);
            fetchAdmins();
          }}
          onClose={() => setAdminEdit(null)}
        />
      )}
    </>
  );
};

export default Admins;