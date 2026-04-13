import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";
import {
  applyLeave,
  getMyLeaves,
  getMyBalance,
  getAllLeaves,
  updateLeaveStatus,
  getLeaveSummary,
} from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyLeave);
router.get("/my-leaves", authMiddleware, getMyLeaves);
router.get("/my-balance", authMiddleware, getMyBalance);

router.get("/summary", authMiddleware, adminOnly, getLeaveSummary);
router.get("/", authMiddleware, adminOnly, getAllLeaves);
router.put("/:id/status", authMiddleware, adminOnly, updateLeaveStatus);

export default router;
