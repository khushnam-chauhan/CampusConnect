const express = require("express");
const { 
  createJob, 
  getPublicJobs, 
  getAllJobsAdmin, 
  getJobById, 
  updateJob, 
  deleteJob, 
  updateJobStatus, 
  getUserJobs 
} = require("../controllers/jobController"); // Ensure correct path

const router = express.Router();

// Public Routes
router.get("/", getPublicJobs); 
router.get("/:id", getJobById); 

// Admin Routes
router.get("/admin", getAllJobsAdmin);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.patch("/:id/status", updateJobStatus);

// User-specific job listings
router.get("/user/:userId", getUserJobs);

module.exports = router;
