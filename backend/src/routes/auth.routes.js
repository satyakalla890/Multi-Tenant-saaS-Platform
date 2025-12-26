const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { registerTenantValidator } = require("../validators/auth.validator");

router.post("/register-tenant", registerTenantValidator, authController.registerTenant);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
