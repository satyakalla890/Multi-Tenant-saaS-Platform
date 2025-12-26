const { validationResult } = require("express-validator");
const userService = require("../services/user.service");

exports.createUser = async (req, res, next) => {
  try {
    validationResult(req).throw();
    const data = await userService.createUser(
      req.params.tenantId,
      req.body,
      req.user
    );
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data,
    });
  } catch (e) {
    next(e);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await userService.listUsers(
      req.params.tenantId,
      req.query
    );
    res.json({ success: true, data: { users } });
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    validationResult(req).throw();
    const data = await userService.updateUser(
      req.params.userId,
      req.body,
      req.user
    );
    res.json({ success: true, message: "User updated successfully", data });
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.userId, req.user);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (e) {
    next(e);
  }
};
