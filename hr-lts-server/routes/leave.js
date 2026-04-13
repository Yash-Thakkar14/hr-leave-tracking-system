import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  applyLeave,
  getMyLeaves,
  getMyBalance,
  getAllLeaves,
  getEmployeeLeaves,
  updateLeaveStatus,
  getLeaveSummary,
} from "../controllers/leaveController.js";

const router = express.Router();

// Employee routes
router.post("/apply", authMiddleware, applyLeave);
router.get("/my-leaves", authMiddleware, getMyLeaves);
router.get("/my-balance", authMiddleware, getMyBalance);

// Admin routes
router.get("/summary", authMiddleware, getLeaveSummary);
router.get("/employee/:employeeId", authMiddleware, getEmployeeLeaves);
router.get("/", authMiddleware, getAllLeaves);
router.put("/:id/status", authMiddleware, updateLeaveStatus);

export default router;
