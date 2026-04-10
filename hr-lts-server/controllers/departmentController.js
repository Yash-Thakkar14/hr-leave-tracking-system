import Department from "../models/Department.js";

const addDepartment = async (req, res) => {
  // Implement logic to add a new department
  try {
    const { dept_name, dept_description } = req.body;
    const newDepartment = new Department({ dept_name, dept_description });
    await newDepartment.save();
    return res.status(200).json({ success: true, department: newDepartment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Server error while adding department" });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error while fetching departments",
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id });
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error while fetching department",
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dept_name, dept_description } = req.body;
    const department = await Department.findByIdAndUpdate(
      { _id: id },
      { dept_name, dept_description },
    );
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error while updating department",
    });
  }
};

export { addDepartment, getDepartments, getDepartment, updateDepartment };
