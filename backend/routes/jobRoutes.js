const express = require("express");
const { 
  createJob, 
  getPublicJobs, 
  getAllJobsAdmin, 
  getJobById, 
  updateJob, 
  deleteJob, 
  updateJobStatus, 
  getJobsByPostedBy,
  searchJobsBySkills,
  searchJobsByCategory
} = require("../controllers/jobController");
const { protect, admin } = require("../middleware/authMiddleware"); 
const router = express.Router();

// Public Routes
router.get("/", getPublicJobs); 
router.get("/:id", getJobById); 

// Admin Routes - Add authentication middleware
router.get("/admin/jobs", protect, admin, getAllJobsAdmin); 
router.post("/", createJob); 
router.put("/:id", protect, admin, updateJob);
router.delete("/:id", protect, admin, deleteJob);
router.patch("/:id/status", protect, admin, updateJobStatus);

// Get jobs by poster
router.get("/posted-by/:postedBy", getJobsByPostedBy);

module.exports = router;