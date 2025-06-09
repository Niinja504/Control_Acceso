import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  UserCheck, 
  Settings, 
  Shield, 
  Clock, 
  Scan, 
  Menu,
  X
} from 'lucide-react';
import '../../components/styles/Sidebar.css'; 
import logoRical from '../../img/logo_rical.png';

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/admin-dashboard/dashboard', icon: Home },
    { name: 'Gestión de docentes', path: '/admin-dashboard/docentes', icon: Users },
    { name: 'Gestión de personal', path: '/admin-dashboard/personal', icon: UserCheck },
    { name: 'Administración de usuarios', path: '/admin-dashboard/usuarios', icon: Settings },
    { name: 'Gestión de permisos', path: '/admin-dashboard/permisos', icon: Shield },
    { name: 'Historial de accesos', path: '/admin-dashboard/historial', icon: Clock },
    { name: 'Registros faciales', path: '/admin-dashboard/registros', icon: Scan },
  ];

  return (
    <>
      {/* Hamburger Menu Button - Solo visible en móvil */}
      <div className="admin-hamburger-menu">
        <img src={logoRical} alt="Logo Ricaldone" className="admin-logo-img" />
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="hamburger-button"
        >
          {isMenuOpen ? <X className="hamburger-icon" /> : <Menu className="hamburger-icon" />}
        </button>
      </div>

      {/* Overlay para cerrar menú en móvil */}
      {isMenuOpen && (
        <div 
          className="admin-mobile-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Unificado */}
      <div className={`admin-sidebar ${isMenuOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="admin-sidebar-header">
          <div className="admin-header-content">
            <div className="admin-logo-container">
              <img src={logoRical} alt="Logo Ricaldone" className="admin-logo-img" />
            </div>
            <div className="admin-header-text">
              <h1 className="admin-institute-title">
                INSTITUTO TÉCNICO
              </h1>
              <h2 className="admin-institute-subtitle">
                RICALDONE
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-navigation">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className="admin-nav-item"
              >
                <Icon className="admin-nav-icon" />
                <span className="admin-nav-text">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}