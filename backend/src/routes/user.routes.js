const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/user.controller");

router.post("/tenants/:tenantId/users", auth, controller.createUser);
router.get("/tenants/:tenantId/users", auth, controller.listUsers);

router.put("/users/:userId", auth, controller.updateUser);
router.delete("/users/:userId", auth, controller.deleteUser);

module.exports = router;
