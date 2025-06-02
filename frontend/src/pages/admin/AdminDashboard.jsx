import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  UserCheck, 
  Settings, 
  Shield, 
  Clock, 
  Scan 
} from 'lucide-react';
import '../../styles/AdminDashboard.css';
import logoRical from '../../img/logo_rical.png'; 

export default function RicaldoneNavigation() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const navigationItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Gestión de docentes', icon: Users },
    { name: 'Gestión de personal', icon: UserCheck },
    { name: 'Administración de usuarios', icon: Settings },
    { name: 'Gestión de permisos', icon: Shield },
    { name: 'Historial de accesos', icon: Clock },
    { name: 'Registros faciales', icon: Scan },
  ];

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        {/* Header */}
        <div className="admin-sidebar-header">
          <div className="admin-header-content">
            <div className="admin-logo-container">
              <img src={logoRical} alt="Logo Ricaldone" className="admin-logo-img" />
            </div>
            <div>
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
            const isActive = item.name === activeItem;
            
            return (
              <button
                key={index}
                onClick={() => setActiveItem(item.name)}
                className={`admin-nav-item${isActive ? ' active' : ''}`}
              >
                <Icon className="admin-nav-icon" />
                <span className="admin-nav-text">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="admin-main-content">
        <div className="admin-content-wrapper">
          <div className="admin-content-card">
            <h1 className="admin-content-title">
              {activeItem}
            </h1>
            <p className="admin-content-description">
              Contenido del módulo "{activeItem}" se mostraría aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}