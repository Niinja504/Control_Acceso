const employeesController = {};
import employeesModel from "../models/Employees.js";
import bcryptjs from "bcryptjs";

// S E L E C T
employeesController.getEmployees = async (req, res) => {
  const employees = await employeesModel.find();
  res.json(employees);
};

// I N S E R T
employeesController.insertEmployees = async (req, res) => {
  const { numEmpleado, names, surnames, DUI, birthday, telephone, email, password, hireDate, department, status, address} = req.body;

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newEmployee = new employeesModel({ numEmpleado, names, surnames, DUI, birthday, telephone, email, password: hashedPassword, hireDate, department, status, address});
  await newEmployee.save();
  res.json({ message: "employee saved" });
};

// D E L E T E
employeesController.deleteEmployees = async (req, res) => {
  await employeesModel.findByIdAndDelete(req.params.id);
  res.json({ message: "employee deleted" });
};

// U P D A T E
employeesController.updateEmployees = async (req, res) => {
  const { numEmpleado, names, surnames, DUI, birthday, telephone, email, password, hireDate, department, status, address} = req.body;
  const updateEmployee = await employeesModel.findByIdAndUpdate(
    req.params.id,
    {numEmpleado, names, surnames, DUI, birthday, telephone, email, password, hireDate, department, status, address},
    { new: true }
  );

  if(!updateEmployee){
    res.json({ message: "employee not found" });
  }else {
    res.json({ message: "employee updated" });
  }
};

export default employeesController;