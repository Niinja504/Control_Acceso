import employeesModel from "../models/Employees.js";
import bcryptjs from "bcryptjs";

const employeesController = {};

// S E L E C T
employeesController.getEmployees = async (req, res) => {
  try {
    const employees = await employeesModel.find().populate("IdTeam");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

// I N S E R T
employeesController.insertEmployees = async (req, res) => {
  try {
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

    // Validar que no se repita el email
    const existing = await employeesModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    // Hash de contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newEmployee = new employeesModel({
      numEmpleado,
      names,
      surnames,
      DUI,
      birthday,
      telephone,
      email,
      password: hashedPassword,
      hireDate,
      IdTeam,
      status,
      address,
    });

    await newEmployee.save();
    res.json({ message: "Employee saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving employee", error });
  }
};

// D E L E T E
employeesController.deleteEmployees = async (req, res) => {
  try {
    const deleted = await employeesModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};

// U P D A T E
employeesController.updateEmployees = async (req, res) => {
  try {
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

    // Preparar datos a actualizar
    const updatedData = {
      numEmpleado,
      names,
      surnames,
      DUI,
      birthday,
      telephone,
      email,
      hireDate,
      IdTeam,
      status,
      address,
    };

    // Si se incluye nueva contraseña, hashearla
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updatedData.password = await bcryptjs.hash(password, salt);
    }

    const updatedEmployee = await employeesModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee updated", employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

export default employeesController;