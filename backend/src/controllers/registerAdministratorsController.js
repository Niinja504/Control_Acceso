import Administrator from "../models/Administrators.js";
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

const registerAdministratorsController = {};

// I N S E R T
registerAdministratorsController.register = async (req, res) => {
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
    status,
    address
  } = req.body;

  try {
    // Verifica si existe el administrador
    const existAdministrator = await Administrator.findOne({ email });
    if (existAdministrator) {
      return res.json({ message: "administrator already exist" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    // Subir foto a cloudinary si existe
    let photoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "administrators",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      photoUrl = result.secure_url;
    }

    const newAdministrator = new Administrator({
      numEmpleado,
      names,
      surnames,
      DUI,
      birthday,
      telephone,
      email,
      password: passwordHash,
      hireDate,
      status,
      address,
      photo: photoUrl,
    });
    await newAdministrator.save();

    jsonwebtoken.sign(
      { id: newAdministrator._id },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) console.log(error);
        res.cookie("authToken", token);
      }
    );
    res.json({ message: "administrator saved" });
  } catch (error) {
    console.log(error);
    res.json({ message: "error register administrator", error });
  }
};

export default registerAdministratorsController;