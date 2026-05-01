import express from "express";
import {
  login,
  verify,
  logout,
  refresh,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.get("/verify", authMiddleware, verify);

export default router;
