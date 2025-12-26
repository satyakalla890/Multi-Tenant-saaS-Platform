const taskService = require("../services/task.service");

exports.createTask = async (req, res, next) => {
  try {
    const data = await taskService.createTask(
      req.params.projectId,
      req.body,
      req.user
    );
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
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
