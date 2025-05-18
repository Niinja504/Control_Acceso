const coordinatorsController = {};
import coordinatorsModel from "../models/Coordinators.js";
import bcryptjs from "bcryptjs";

// S E L E C T
coordinatorsController.getCoordinators = async (req, res) => {
  const coordinators = await coordinatorsModel.find();
  res.json(coordinators);
};

// I N S E R T
coordinatorsController.insertCoordinator = async (req, res) => {
  const { names, surnames, email, password, department } = req.body;

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newCoordinator = new coordinatorsModel({
    names,
    surnames,
    email,
    password: hashedPassword,
    department,
  });
  await newCoordinator.save();
  res.json({ message: "coordinator saved" });
};

// D E L E T E
coordinatorsController.deleteCoordinator = async (req, res) => {
  await coordinatorsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "coordinator deleted" });
};

// U P D A T E
coordinatorsController.updateCoordinator = async (req, res) => {
  const { names, surnames, email, password, department } = req.body;

  const updateCoordinator = await coordinatorsModel.findByIdAndUpdate(
    req.params.id,
    { names, surnames, email, password, department },
    { new: true }
  );

  if (!updateCoordinator) {
    res.json({ message: "coordinator not found" });
  } else {
    res.json({ message: "coordinator updated" });
  }
};

export default coordinatorsController;