const loginController = {};

import EmployeesModel from "../models/Employees.js";
import CoordinatorsModel from "../models/Coordinators.js"; // Modelo para coordinadores
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";


// I N S E R T
loginController.login = async (req, res) => {
  const { email, password} = req.body;
  try{
    //Validamos los 2 posibles niveles
    //1. Admin, 2. Empleado
    let userFound;
    let userType;

    //1. Admin
    if (email === config.emailAdmin.email && password === config.emailAdmin.password) {
      userType = "Admin";
      userFound = { _id: "Admin" };
    } else {
      // 2. Coordinador
      userFound = await CoordinatorsModel.findOne({ email });
      if (userFound) {
        userType = "Coordinator";
      } else {
        // 3. Empleado
        userFound = await EmployeesModel.findOne({ email });
        userType = "Employee";
      }

      if (!userFound) {
        return res.status(401).json({ message: "user not found" });
      }

      // Validar contraseña
      const isMatch = await bcryptjs.compare(password, userFound.password);
      if (!isMatch) {
          return res.status(401).json({ message: "invalid password" });
      }
    }

    // Generar token
    jsonwebtoken.sign(
      { id: userFound._id, userType }, // Datos a guardar
      config.JWT.secret, // Clave secreta
      { expiresIn: config.JWT.expiresIn }, // Tiempo de expiración
      (error, token) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error generating token" });
        }
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: false, // Cambiar a true si usas HTTPS
          sameSite: "lax",
        });
        res.json({ message: "login successful", userType });
      }
    );
    }
  catch (error) {
     console.log(error);
     res.status(500).json({ message: "Internal server error" });
  }
};


export default loginController;