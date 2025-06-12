import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const useDataTeams = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamEdit, setTeamEdit] = useState(null);

  // Obtener todos los equipos
  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/teams");
      console.log("Equipos obtenidos:", res.data);
      setTeams(res.data);
    } catch (err) {
      console.error("Error al obtener equipos:", err);
    }
  };

  // Insertar o actualizar equipo
  const saveTeam = async (teamData) => {
    try {
      if (teamEdit) {
        // Actualizar equipo
        await axios.put(
          `http://localhost:4000/api/teams/${teamEdit._id}`,
          teamData
        );
        Swal.fire("¡Actualizado!", "El equipo ha sido actualizado.", "success");
      } else {
        // Insertar equipo nuevo
        await axios.post("http://localhost:4000/api/teams", teamData);
        Swal.fire("¡Guardado!", "El equipo ha sido guardado.", "success");
      }
      fetchTeams();
      handleCloseModal();
    } catch (err) {
      console.error("Error al guardar/actualizar equipo:", err);
      Swal.fire("Error", "No se pudo guardar el equipo.", "error");
    }
  };

  // Eliminar equipo con confirmación
  const eliminarTeam = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción eliminará el equipo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/teams/${id}`);
        Swal.fire("¡Eliminado!", "El equipo ha sido eliminado.", "success");
        fetchTeams();
      } catch (err) {
        console.error("Error al eliminar equipo:", err);
        Swal.fire("Error", "No se pudo eliminar el equipo.", "error");
      }
    }
  };

  // Cerrar modal y limpiar edición
  const handleCloseModal = () => {
    setShowRegister(false);
    setTeamEdit(null);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    showRegister,
    setShowRegister,
    teams,
    setTeams,
    teamEdit,
    setTeamEdit,
    fetchTeams,
    saveTeam,
    eliminarTeam,
    handleCloseModal,
  };
};

export default useDataTeams;
