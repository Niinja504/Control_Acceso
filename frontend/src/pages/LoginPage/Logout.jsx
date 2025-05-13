import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Logout = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();

 
    useEffect(() => {
        const doLogout = async () => {
          await logout();           // Llama a la función del AuthContext
          navigate("/login");       // Redirige al login
        };
    
        doLogout();
      }, []);

  return (
    <h1>Cerrando Sesion...</h1>
  )
}
