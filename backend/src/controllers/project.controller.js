const projectService = require("../services/project.service");

exports.createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.listProjects = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const projects = await projectService.getProjects({
      tenantId: req.user.tenantId,
      status,
      search,
      limit,
      offset,
    });

    res.json({ success: true, data: { projects } });
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!project || project.tenant_id !== req.user.tenantId) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (
      req.user.role !== "tenant_admin" &&
      project.created_by !== req.user.userId
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const updated = await projectService.updateProject(
      req.params.projectId,
      req.body
    );

    res.json({ success: true, message: "Project updated successfully", data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);

    if (!project || project.tenant_id !== req.user.tenantId) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (
      req.user.role !== "tenant_admin" &&
      project.created_by !== req.user.userId
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await projectService.deleteProject(req.params.projectId);

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};
