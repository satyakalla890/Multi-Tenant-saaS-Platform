const tenantService = require("../services/tenant.service");

exports.getTenantDetails = async (req, res, next) => {
  try {
    const data = await tenantService.getTenantDetails(
      req.params.tenantId,
      req.user
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateTenant = async (req, res, next) => {
  try {
    const data = await tenantService.updateTenant(
      req.params.tenantId,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.listTenants = async (req, res, next) => {
  try {
    const data = await tenantService.listTenants(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
