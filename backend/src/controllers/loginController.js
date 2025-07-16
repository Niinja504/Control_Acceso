import EmployeesModel from "../models/Employees.js";
import CoordinatorsModel from "../models/Coordinators.js";
import AdministratorsModel from "../models/Administrators.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// I N S E R T
loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound;
    let userType;

    // 1. Admin desde .env (superusuario)
    if (email === config.emailAdmin.email && password === config.emailAdmin.password) {
      userType = "Admin";
      userFound = { _id: "Admin" };
    } else {
      // 2. Buscar en administradores
      userFound = await AdministratorsModel.findOne({ email });
      if (userFound) {
        userType = "Admin";
      } else {
        // 3. Buscar en coordinadores
        userFound = await CoordinatorsModel.findOne({ email });
        if (userFound) {
          userType = "Coordinator";
        } else {
          // 4. Buscar en empleados
          userFound = await EmployeesModel.findOne({ email });
          userType = "Employee";
        }
      }

      if (!userFound) {
        return res.status(401).json({ message: "user not found" });
      }

      const isMatch = await bcryptjs.compare(password, userFound.password);
      if (!isMatch) {
        return res.status(401).json({ message: "invalid password" });
      }
    }

    // Crear payload
    const tokenPayload = {
      id: userFound._id,
      userType,
    };

    // Agregar info extendida si es Coordinador o Empleado
    if (userType === "Coordinator" || userType === "Employee") {
      tokenPayload.names = userFound.names;
      tokenPayload.surnames = userFound.surnames;
      tokenPayload.fullName = `${userFound.names} ${userFound.surnames}`;
      tokenPayload.idTeam = userFound.IdTeam;
      tokenPayload.department = userFound.department;
      tokenPayload.numEmpleado = userFound.numEmpleado;
      tokenPayload.photo = userFound.photo;
    }

    // Firmar token
    jsonwebtoken.sign(
      tokenPayload,
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error generating token" });
        }

        // Cookie con el JWT
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });

        // Cookie visible al frontend con info básica del usuario
        if (userType === "Coordinator" || userType === "Employee") {
          res.cookie("userInfo", {
            userType,
            fullName: tokenPayload.fullName,
            idTeam: tokenPayload.idTeam,
            numEmpleado: tokenPayload.numEmpleado,
            department: tokenPayload.department,
            photo: tokenPayload.photo,
          }, {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
          });
        }

        // Respuesta al frontend
        res.json({
          message: "login successful",
          userType,
          token,
          fullName: tokenPayload.fullName || null,
          idTeam: tokenPayload.idTeam || null,
        });
      }
    );

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default loginController;
