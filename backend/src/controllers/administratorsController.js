const administratorsController = {};
import administratorsModel from "../models/Administrators.js";
import bcryptjs from "bcryptjs";

// S E L E C T
administratorsController.getAdministrators = async (req, res) => {
  const administrators = await administratorsModel.find();
  res.json(administrators);
};

// I N S E R T
administratorsController.insertAdministrator = async (req, res) => {
  const { numEmpleado, names, surnames, DUI, birthday, telephone, email, password, hireDate, department, status, address } = req.body;

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newAdministrator = new administratorsModel({
    numEmpleado,
    names,
    surnames,
    DUI,
    birthday,
    telephone,
    email,
    password: hashedPassword,
    hireDate,
    department,
    status,
    address
  });
  await newAdministrator.save();
  res.json({ message: "administrator saved" });
};

// D E L E T E
administratorsController.deleteAdministrator = async (req, res) => {
  await administratorsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "administrator deleted" });
};

// U P D A T E
administratorsController.updateAdministrator = async (req, res) => {
  const { numEmpleado, names, surnames, DUI, birthday, telephone, email, password, hireDate, department, status, address } = req.body;

  const updateAdministrator = await administratorsModel.findByIdAndUpdate(
    req.params.id,
    { numEmpleado, names, surnames, DUI, birthday, telephone, email, password, hireDate, department, status, address },
    { new: true }
  );

  if (!updateAdministrator) {
    res.json({ message: "administrator not found" });
  } else {
    res.json({ message: "administrator updated" });
  }
};

export default administratorsController;