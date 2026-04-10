import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Access denied: Admins only" });
  }
  next();
};

export default authMiddleware;
