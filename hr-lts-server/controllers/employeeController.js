import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

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

export { addEmployee };
