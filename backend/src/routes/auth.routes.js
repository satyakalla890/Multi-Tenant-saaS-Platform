const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { registerTenantValidator } = require("../validators/auth.validator");

router.post(
  "/register-tenant",
  registerTenantValidator,
  authController.registerTenant
);

module.exports = router;
