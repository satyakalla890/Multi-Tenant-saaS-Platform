const express = require("express");
const router = express.Router();

const tenantController = require("../controllers/tenant.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  requireSuperAdmin,
  requireTenantAdminOrSuperAdmin,
} = require("../middleware/role.middleware");

// API 5
router.get(
  "/:tenantId",
  authMiddleware,
  tenantController.getTenantDetails
);

// API 6
router.put(
  "/:tenantId",
  authMiddleware,
  requireTenantAdminOrSuperAdmin,
  tenantController.updateTenant
);

// API 7
router.get(
  "/",
  authMiddleware,
  requireSuperAdmin,
  tenantController.listTenants
);

module.exports = router;
