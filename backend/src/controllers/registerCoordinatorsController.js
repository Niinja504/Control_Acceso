const registerCoordinatorsController = {};

import Coordinator from "../models/Coordinators.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

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
    department,
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
      department,
      status,
      address
    });
    await newCoordinator.save();
    res.json({ message: "coordinator saved" });

    jsonwebtoken.sign(
      { id: newCoordinator._id },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) console.log(error);
        res.cookie("authToken", token);
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ message: "error register coordinator", error });
  }
};

export default registerCoordinatorsController;