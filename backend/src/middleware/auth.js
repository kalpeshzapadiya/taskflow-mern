const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token is invalid or expired" });
  }
};

exports.restrictToOrgRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const orgId =
        req.headers["x-organization-id"] ||
        req.params.orgId ||
        req.body.organizationId;
      if (!orgId) {
        return res
          .status(400)
          .json({ success: false, message: "Organization context is missing" });
      }

      const org = await Organization.findOne({
        _id: orgId,
        "memberships.user": req.user.id,
      });

      if (!org) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this organization",
        });
      }

      const membership = org.memberships.find(
        (m) => m.user.toString() === req.user.id,
      );
      if (
        !allowedRoles.includes(membership.role) &&
        membership.role !== "SuperAdmin"
      ) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }

      req.membership = membership;
      req.organization = org;
      next();
    } catch (err) {
      next(err);
    }
  };
};
