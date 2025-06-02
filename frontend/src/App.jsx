import React from 'react';
//import { AuthProvider } from './context/AuthProvider'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard.jsx';
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* Redirecciona al Dashboard */}
          <Route path="" element={<Navigate to="dashboard" />} />
          {/* Todas las Routes del AdminDashboard */}
          <Route path="dashboard" element={<h1>Dashboard</h1>} />
          <Route path="docentes" element={<h1>Gestión de Docentes</h1>} />
          <Route path="personal" element={<h1>Gestión de Personal</h1>} />
          <Route path="usuarios" element={<h1>Administración de Usuarios</h1>} />
          <Route path="permisos" element={<h1>Gestión de Permisos</h1>} />
          <Route path="historial" element={<h1>Historial de Accesos</h1>} />
          <Route path="registros" element={<h1>Registros Faciales</h1>} />
        </Route>
        <Route
          path="/coordinator-dashboard"
          element={
            <ProtectedRoute allowedRoles={['Coordinator']}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;