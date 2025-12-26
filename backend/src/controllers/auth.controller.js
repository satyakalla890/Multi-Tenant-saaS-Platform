const authService = require("../services/auth.service");
const { validationResult } = require("express-validator");

// Tenant registration
const registerTenant = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const result = await authService.registerTenant(req.body);
    res.status(201).json({ success: true, message: "Tenant registered successfully", data: result });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Get Current User
const getMe = async (req, res, next) => {
  try {
    const data = await authService.getCurrentUser(req.user.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ✅ Export ALL functions as an object
module.exports = {
  registerTenant,
  login,
  getMe,
  logout,
};
