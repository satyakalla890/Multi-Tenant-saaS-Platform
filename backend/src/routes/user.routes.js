const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const userCtrl = require("../controllers/user.controller");
const { createUserValidator, updateUserValidator } = require("../validators/user.validator");

router.post(
  "/tenants/:tenantId/users",
  auth,
  createUserValidator,
  userCtrl.createUser
);

router.get(
  "/tenants/:tenantId/users",
  auth,
  userCtrl.listUsers
);

router.put(
  "/users/:userId",
  auth,
  updateUserValidator,
  userCtrl.updateUser
);

router.delete(
  "/users/:userId",
  auth,
  userCtrl.deleteUser
);

module.exports = router;
