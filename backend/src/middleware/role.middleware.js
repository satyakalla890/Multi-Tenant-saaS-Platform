exports.requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Super admin access required",
    });
  }
  next();
};

exports.requireTenantAdminOrSuperAdmin = (req, res, next) => {
  if (
    req.user.role !== "tenant_admin" &&
    req.user.role !== "super_admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    });
  }
  next();
};
