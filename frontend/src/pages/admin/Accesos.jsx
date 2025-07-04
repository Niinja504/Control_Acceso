import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, ChevronDown } from 'lucide-react';
import '../../styles/Admin/Accesos.css';
import icon from '../../img/salida_acceso.png';

const HorarioOptions = ['Entrada', 'Salida'];

export default function Accesos() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [docentesOptions, setDocentesOptions] = useState(['Todos']);
  const [selectedDocente, setSelectedDocente] = useState('Todos');
  const [selectedSalida, setSelectedSalida] = useState(HorarioOptions[0]);
  const [accessData, setAccessData] = useState([]);
  const docentesRef = useRef(null);
  const salidasRef = useRef(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/teams');
        const teamNames = res.data.map(team => team.name);
        setDocentesOptions(['Todos', ...teamNames]);
      } catch (error) {
        console.error('Error al cargar los equipos:', error);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchAccessData = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/access');
        setAccessData(res.data);
      } catch (error) {
        console.error('Error al cargar los registros de acceso:', error);
      }
    };
    fetchAccessData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (openDropdown === 'docentes' && docentesRef.current && !docentesRef.current.contains(event.target)) ||
        (openDropdown === 'salidas' && salidasRef.current && !salidasRef.current.contains(event.target))
      ) {
        setOpenDropdown(null);
      }
    }

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSelectDocente = (option) => {
    setSelectedDocente(option);
    setOpenDropdown(null);
  };

  const handleSelectSalida = (option) => {
    setSelectedSalida(option);
    setOpenDropdown(null);
  };

  return (
    <div className="access-history-container">
      <div className="encabezado-accesos">
        <h1 className="titulo">Historial de accesos</h1>

        <div className="search-bar">
          <Search className="search-icon" />
          <input type="text" placeholder="Buscar por nombre o apellido" />
        </div>

        <div className="filters">
          <div className="dropdown" ref={docentesRef}>
            <button className="filter-button docentes" onClick={() => handleDropdown('docentes')}>
              {selectedDocente} <ChevronDown size={16} />
            </button>
            {openDropdown === 'docentes' && (
              <div className="dropdown-menu docentes">
                {docentesOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectDocente(option)}
                    className={selectedDocente === option ? 'selected' : ''}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown" ref={salidasRef}>
            <button className="filter-button salidas" onClick={() => handleDropdown('salidas')}>
              {selectedSalida} <ChevronDown size={16} />
            </button>
            {openDropdown === 'salidas' && (
              <div className="dropdown-menu salidas">
                {HorarioOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectSalida(option)}
                    className={selectedSalida === option ? 'selected' : ''}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="access-list-container">
        <div className="access-list">
          {accessData.length === 0 ? (
            <p>No hay registros de acceso para mostrar.</p>
          ) : (
            accessData.map((person, index) => (
              <div className="access-card" key={index}>
                <div className="user-info">
                  <span className="status-dot" />
                  <img src={person.avatar} alt="Avatar" />
                  <p style={{ color: "#000000ab" }}>
                    Nombre: {person.name}
                  </p>
                </div>
                <div className="exit-info">
                  <img src={icon} alt="Ícono de salida" width={18} height={18} />
                  <span>{selectedSalida}: {person.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
