import Coordinator from "../models/Coordinators.js";
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

const registerCoordinatorsController = {};

// I N S E R T
registerCoordinatorsController.register = async (req, res) => {
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
    address
  } = req.body;

  try {
    // Verifica si existe el coordinador
    const existCoordinator = await Coordinator.findOne({ email });
    if (existCoordinator) {
      return res.json({ message: "coordinator already exist" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    // Subir foto a cloudinary si existe
    let photoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "coordinators",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      photoUrl = result.secure_url;
    }

    const newCoordinator = new Coordinator({
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
    await newCoordinator.save();

    jsonwebtoken.sign(
      { id: newCoordinator._id },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) console.log(error);
        res.cookie("authToken", token);
      }
    );
     res.json({ message: "coordinator saved" });
  } catch (error) {
    console.log(error);
    res.json({ message: "error register coordinator", error });
  }
};

export default registerCoordinatorsController;