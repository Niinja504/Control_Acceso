import EmployeesModel from "../models/Employees.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

loginController.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }
  
    try {
      let userFound;
      let userType;
  
      // 1. Primero verificar si es el Admin hardcodeado
      if (email === config.emailAdmin.email && password === config.emailAdmin.password) {
        userType = "Admin";
        userFound = { _id: "Admin" };
      } else {
        // 2. Buscar en empleados
        userFound = await EmployeesModel.findOne({ email });
        
        // Si es empleado, verificar si es Admin por su cargo
        if (userFound) {
          userType = userFound.chargue === "Admin" ? "Admin" : "Employee";
        } 
      }
  
      if (!userFound) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Validar contraseña si no es el Admin hardcodeado
      if (!(email === config.emailAdmin.email && password === config.emailAdmin.password)) {
        if (!userFound.password) {
          return res.status(400).json({ message: "Contraseña no configurada" });
        }
  
        const isMatch = await bcryptjs.compare(password, userFound.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Contraseña incorrecta" });
        }
      }
  
      // Generar token
      const token = jsonwebtoken.sign(
        { id: userFound._id, userType },
        config.JWT.secret,
        { expiresIn: config.JWT.expiresIn }
      );

      const userData = {
        userId: userFound._id,
        userType: userFound.userType,
        email: userFound.email
      };
  
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      });

      res.cookie("userData", encodeURIComponent(JSON.stringify(userData)), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
        encode: String // Esto evita la doble codificación
      });
  
      return res.json({ 
        status: "success",
        message: "Login exitoso",
        user: userData,
       
      });
  
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
};

export default loginController;