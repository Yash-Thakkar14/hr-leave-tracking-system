import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

const generateRefreshToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, error: "Password is incorrect" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Clear any existing cookie first to prevent duplicates
    res.clearCookie("refreshToken", clearCookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      accessToken,
      user: { userId: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, error: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    const accessToken = generateAccessToken(user);
    return res.status(200).json({
      success: true,
      accessToken,
      user: { userId: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired refresh token" });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie("refreshToken", clearCookieOptions);
  return res.status(200).json({ success: true, message: "Logged out" });
};

// GET /api/auth/verify
const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export { login, refresh, logout, verify };
