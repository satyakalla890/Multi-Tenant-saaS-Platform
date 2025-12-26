const { body } = require("express-validator");

exports.createUserValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password min 8 chars"),
  body("fullName").notEmpty().withMessage("Full name required"),
  body("role").optional().isIn(["user", "tenant_admin"]),
];

exports.updateUserValidator = [
  body("fullName").optional().notEmpty(),
  body("role").optional().isIn(["user", "tenant_admin"]),
  body("isActive").optional().isBoolean(),
];
