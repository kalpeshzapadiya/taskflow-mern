const express = require("express");
const router = express.Router();

const {
  register, login, refreshToken, logout, getProfile, updateProfile,
} = require("../controllers/authController");
const { getOrganizationAnalytics } = require("../controllers/analyticsController");
const { getProjectTasks, updateTaskStatus } = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const { getProjects, createProject, getProjectById } = require("../controllers/projectController");

// Authentication and profile
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refresh-token", refreshToken);
router.post("/auth/logout", logout);
router.get("/auth/me", protect, getProfile);
router.patch("/auth/profile", protect, updateProfile);

// Projects
router.get("/projects", protect, getProjects);
router.post("/projects", protect, createProject);
router.get("/projects/:projectId", protect, getProjectById);
router.get("/projects/:projectId/tasks", protect, getProjectTasks);
router.patch("/tasks/:taskId/status", protect, updateTaskStatus);

// Analytics
router.get("/analytics", protect, getOrganizationAnalytics);

module.exports = router;
