const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/task.controller");
const { createTaskValidator, updateTaskStatusValidator } = require("../validators/task.validator");

router.post("/projects/:projectId/tasks", auth, createTaskValidator, controller.createTask);
router.get("/projects/:projectId/tasks", auth, controller.listTasks);
router.patch("/tasks/:taskId/status", auth, updateTaskStatusValidator, controller.updateTaskStatus);

module.exports = router;
