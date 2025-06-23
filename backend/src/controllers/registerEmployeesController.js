import Employee from "../models/Employees.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import { v2 as cloudinary } from "cloudinary";

// Configurar cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const registerEmployeesController = {};

// I N S E R T
registerEmployeesController.register = async (req, res) => {
  // Desestructuramos todos los campos necesarios, incluyendo hireDate
  const {
    numEmpleado,
    names,
    surnames,
    DUI,
    birthday,
    telephone,
    email,
    password,
    hireDate,
    IdTeam,
    status,
    address,
  } = req.body;

  try {
    // Verifica si existe el empleado con ese email
    const existEmployee = await Employee.findOne({ email });
    if (existEmployee) {
      return res.json({ message: "employee already exist" });
    }

    // Hashea la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // Subir foto a cloudinary si existe
    let photoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "employees",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      photoUrl = result.secure_url;
    }

    // Crea el nuevo empleado con todos los campos
    const newEmployee = new Employee({
      numEmpleado,
      names,
      surnames,
      DUI,
      birthday,
      telephone,
      email,
      password: passwordHash,
      hireDate,
      IdTeam,
      status,
      address,
      photo: photoUrl,
    });

    // Guarda en base de datos
    await newEmployee.save();

    // Genera token JWT y lo envía en cookie
    jsonwebtoken.sign(
      { id: newEmployee._id },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) console.log(error);
        else res.cookie("authToken", token);
      }
    );

    // Envía respuesta de éxito
    res.json({ message: "employee saved" });
  } catch (error) {
    console.log(error);
    res.json({ message: "error register employee", error });
  }
};

export default registerEmployeesController;