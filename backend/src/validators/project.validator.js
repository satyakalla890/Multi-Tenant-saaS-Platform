const { body } = require("express-validator");

exports.createProjectValidator = [
  body("name").notEmpty().withMessage("Project name is required"),
];

exports.updateProjectValidator = [
  body("name").optional().isString(),
  body("description").optional().isString(),
  body("status").optional().isIn(["active", "archived", "completed"]),
];
