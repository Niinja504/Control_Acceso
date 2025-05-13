import React, { createContext, useEffect, useState } from "react";
import { Global } from "../helpers/Global";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    userId: null,
    userType: null,
    email: null
  });
  const [loading, setLoading] = useState(true);

  // Funciones para manejar cookies y autenticación
  const getUserDataFromCookies = () => {
    const cookies = document.cookie.split("; ");
    const userDataCookie = cookies.find((row) => row.startsWith("userData="));
    return userDataCookie
      ? JSON.parse(decodeURIComponent(userDataCookie.split("=")[1]))
      : null;
  };

  const saveUserDataToCookies = (userData) => {
    document.cookie = `userData=${encodeURIComponent(
      JSON.stringify(userData)
    )}; path=/; max-age=86400`; // 1 día
  };

  const deleteUserDataCookie = () => {
    document.cookie = "userData=; Max-Age=0; path=/;";
  };

  const authUser = () => {
    const userData = getUserDataFromCookies();
    if (userData) {
      setAuth(userData);
      setLoading(false);
      return true;
    } else {
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    authUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(Global.url + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        const userData = {
          userId: data.user.userId,
          userType: data.user.userType,
          email: data.user.email,
        };

        // Guardar en cookie y estado
        saveUserDataToCookies(userData);
        setAuth(userData);

        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Error de conexión" };
    }
  };

  const logout = async () => {
    try {
      await fetch(Global.url + "logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAuth({ userId: null, userType: null, email: null });
      deleteUserDataCookie();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth, // Asegúrate de que 'setAuth' esté disponible aquí
        loading,
        login,
        logout,
        isAuthenticated: !!auth.userId,
        isAdmin: auth.userType === "Admin",
        isEmployee: auth.userType === "Employee",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
