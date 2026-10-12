const express = require("express");
const router = express.Router();

const {
  getProjects,
  createProject,
} = require("../controllers/projectController");

// Replace this import with the authentication middleware
// already used by your application.
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getProjects);
router.post("/", protect, createProject);

module.exports = router;
