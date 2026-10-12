const mongoose = require("mongoose");
const Project = require("../models/Project");
const Organization = require("../models/Organization");

async function getOrganizationContext(req) {
  const userId = req.user?.id;
  const requestedOrgId = req.headers["x-organization-id"];

  if (!userId) return null;

  let org;
  if (requestedOrgId && mongoose.isValidObjectId(requestedOrgId)) {
    org = await Organization.findOne({
      _id: requestedOrgId,
      "memberships.user": userId,
      "memberships.status": "Active",
    });
  } else {
    org = await Organization.findOne({
      "memberships.user": userId,
      "memberships.status": "Active",
    });
  }
  return org;
}

exports.getProjects = async (req, res, next) => {
  try {
    const org = await getOrganizationContext(req);
    if (!org) {
      return res.status(403).json({
        success: false,
        message: "No active organization found for this account.",
      });
    }
    const projects = await Project.find({ organization: org._id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: projects.length, projects, data: projects });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }
    const org = await getOrganizationContext(req);
    if (!org) return res.status(403).json({ success: false, message: "No active organization found." });

    const project = await Project.findOne({
      _id: req.params.projectId,
      organization: org._id,
    });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    return res.json({ success: true, project, data: project });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { name, description = "", status = "planning", deadline } = req.body || {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }
    const org = await getOrganizationContext(req);
    if (!org) return res.status(403).json({ success: false, message: "No active organization found." });

    const allowedStatuses = ["planning", "active", "completed", "on-hold"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid project status" });
    }
    const project = await Project.create({
      name: name.trim(),
      description: String(description).trim(),
      status,
      organization: org._id,
      createdBy: req.user.id,
      ...(deadline ? { deadline: new Date(deadline) } : {}),
    });
    return res.status(201).json({ success: true, message: "Project created", project, data: project });
  } catch (error) {
    next(error);
  }
};
