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
  getBradfordReport,
  getAbsenceTrends,
  getAbsencePatterns,
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyLeave);
router.get("/my-leaves", authMiddleware, getMyLeaves);
router.get("/my-balance", authMiddleware, getMyBalance);
router.get("/summary", authMiddleware, getLeaveSummary);
router.get("/reports/bradford", authMiddleware, getBradfordReport);
router.get("/reports/trends", authMiddleware, getAbsenceTrends);
router.get("/reports/patterns", authMiddleware, getAbsencePatterns);
router.get("/employee/:employeeId", authMiddleware, getEmployeeLeaves);
router.get("/", authMiddleware, getAllLeaves);
router.put("/:id/status", authMiddleware, updateLeaveStatus);

export default router;
