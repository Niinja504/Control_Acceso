const registerEmployeesController = {};

import Employee from "../models/Employees.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

// I N S E R T
registerEmployeesController.register = async (req, res) => {
  const { numEmpleado, names, surnames, DUI, birthday, telephone, email, password, IdTeam, status, address } = req.body;
  try {
    // Verifica si existe el empleado
    const existEmployee = await Employee.findOne({ email });
    if (existEmployee) {
      return res.json({ message: "employee already exist" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newEmployee = new Employee({
      numEmpleado,
      names,
      surnames,
      DUI,
      birthday,
      telephone,
      email,
      password: passwordHash,
      IdTeam, // Reemplazado department por IdTeam
      status,
      address,
    });
    await newEmployee.save();
    res.json({ message: "employee saved" });

    jsonwebtoken.sign(
      // 1- Qué voy a guardar
      { id: newEmployee._id },
      // 2- Clave secreta
      config.JWT.secret,
      // 3- Cuándo expira
      { expiresIn: config.JWT.expiresIn },
      // 4- Función flecha
      (error, token) => {
        if (error) console.log(error);
        res.cookie("authToken", token);
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ message: "error register employee", error });
  }
};

export default registerEmployeesController;