import EmployeesModel from "../models/Employees.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// Login con validación de correo
loginController.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Primero validamos el correo (si el correo no es válido, responde antes)
    const correoValido = email.endsWith('@ricaldone.edu.sv');
    if (!correoValido) {
      return res.status(400).json({ message: "El correo no es valido" });
    }

    // Validamos los 2 posibles niveles: Admin y Empleado
    let userFound;
    let userType;

    // 1. Admin
    if (email === config.emailAdmin.email && password === config.emailAdmin.password) {
      userType = "Admin";
      userFound = { _id: "Admin" }; // Se asigna un objeto con _id "Admin"
    } else {
      // 2. Empleado
      userFound = await EmployeesModel.findOne({ email });
      userType = "Employee";
    }

    // Si no encontramos un usuario
    if (!userFound) {
      return res.json({ message: "Usuario no encontrado" });
    }

    // Si no es administrador, validamos la contraseña
    if (userType !== "Admin") {
      const isMatch = await bcryptjs.compare(password, userFound.password);
      if (!isMatch) {
        return res.json({ message: "Contraseña inválida" });
      }
    }

    // Generamos el token de acceso
    jsonwebtoken.sign(
      { id: userFound._id, userType },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) {
          console.log(error);
        } else {
          res.cookie("authToken", token); // Guardamos el token en la cookie
          res.json({ message: "Inicio de sesión exitoso" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Hubo un error al intentar iniciar sesión" });
  }
};

export default loginController;
