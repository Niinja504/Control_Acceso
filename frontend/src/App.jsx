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
          {}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
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

