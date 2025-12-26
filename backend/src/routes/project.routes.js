const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const projectController = require("../controllers/project.controller");
const {
  createProjectValidator,
  updateProjectValidator,
} = require("../validators/project.validator");

router.post("/", auth, createProjectValidator, projectController.createProject);
router.get("/", auth, projectController.listProjects);
router.put("/:projectId", auth, updateProjectValidator, projectController.updateProject);
router.delete("/:projectId", auth, projectController.deleteProject);

module.exports = router;
