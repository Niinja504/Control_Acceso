const employeesController = {};
import employeesModel from "../models/Employees.js";

// S E L E C T
employeesController.getEmployees = async (req, res) => {
  const employees = await employeesModel.find();
  res.json(employees);
};

// I N S E R T
employeesController.insertEmployees = async (req, res) => {
  const { names, surnames, DUI, birthday, telephone, emaile, password, department, status} = req.body;
  const newEmployee = new employeesModel({names, surnames, DUI, birthday, telephone, emaile, password, department, status});
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
  const {names, surnames, DUI, birthday, telephone, emaile, password, department, status  } = req.body;
  const updateEmployee = await employeesModel.findByIdAndUpdate(
    req.params.id,
    {  names, surnames, DUI, birthday, telephone, emaile, password, department, status},
    { new: true }
  );

  if(!updateEmployee){
    res.json({ message: "employee not found" });
  }else {
    res.json({ message: "employee updated" });
  }
};

export default employeesController;