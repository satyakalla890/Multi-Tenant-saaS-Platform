const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const projectController = require("../controllers/project.controller");
const controller = require("../controllers/task.controller");
const {
  createProjectValidator,
  updateProjectValidator,
} = require("../validators/project.validator");

const {
  createTaskValidator,
  updateTaskStatusValidator
} = require("../validators/task.validator");

router.post("/", auth, createProjectValidator, projectController.createProject);
router.get("/", auth, projectController.listProjects);
router.put("/:projectId", auth, updateProjectValidator, projectController.updateProject);
router.delete("/:projectId", auth, projectController.deleteProject);

router.post("/:projectId/tasks", auth, createTaskValidator, controller.createTask);
router.get("/:projectId/tasks", auth, controller.listTasks);
router.patch("/tasks/:taskId/status", auth, updateTaskStatusValidator, controller.updateTaskStatus);
module.exports = router;
