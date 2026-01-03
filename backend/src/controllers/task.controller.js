const taskService = require("../services/task.service");

exports.createTask = async (req, res, next) => {
  try {
    if (!req.params.projectId) {
      return res.status(400).json({ message: "Project ID missing" });
    }

    const data = await taskService.createTask(
      req.params.projectId,
      req.body,
      req.user
    );

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};


exports.listTasks = async (req, res, next) => {
  try {
    const data = await taskService.listTasks(
      req.params.projectId,
      req.user,
      req.query
    );
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const data = await taskService.updateTaskStatus(
      req.params.taskId,
      req.body.status,
      req.user
    );
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.taskId, req.user);
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const data = await taskService.updateTask(
      req.params.taskId,
      req.body,
      req.user
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

