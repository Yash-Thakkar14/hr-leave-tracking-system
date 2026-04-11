import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Department from "../models/Department.js";

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      gender,
      designation,
      department,
      password,
      role,
    } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role: role || "employee",
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      gender,
      designation,
      department,
    });
    await newEmployee.save();
    return res
      .status(200)
      .json({ success: true, message: "Employee created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error while creating employee" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error while fetching employees",
    });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error while fetching employee details",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department } = req.body;
    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }
    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: employee.userId },
      { name },
    );
    const updateEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      { designation, department },
    );
    if (!updateUser || !updateEmployee) {
      return res
        .status(500)
        .json({ success: false, error: "Error updating employee" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error while updating employee",
    });
  }
};

export { addEmployee, getEmployees, getEmployee, updateEmployee };
