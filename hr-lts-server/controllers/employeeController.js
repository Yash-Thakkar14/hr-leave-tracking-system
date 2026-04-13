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

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "A user with this email already exists",
      });
    }

    // Check for duplicate employeeId
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: "Employee ID already in use. Please use a different one.",
      });
    }

    // Hash password without any length validation — length is the admin's responsibility
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
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        success: false,
        error: `Duplicate value: ${field} already exists.`,
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ success: false, error: messages });
    }
    return res.status(500).json({ success: false, error: error.message });
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
    const employee = await Employee.findById(id)
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

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await User.findByIdAndUpdate(employee.userId, { name });
    await Employee.findByIdAndUpdate(id, { designation, department });

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
