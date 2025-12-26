const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");

exports.registerTenant = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const result = await authService.registerTenant(req.body);

    res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
