const { body } = require("express-validator");

exports.createTaskValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
];

exports.updateTaskStatusValidator = [
  body("status")
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Invalid status")
];
