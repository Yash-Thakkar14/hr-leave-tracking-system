import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEmployee,
  getEmployees,
  getEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", authMiddleware, getEmployees);
router.post("/add", authMiddleware, addEmployee);
router.get("/:id", authMiddleware, getEmployee);
// router.put("/:id", authMiddleware, updateDepartment);
// router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
