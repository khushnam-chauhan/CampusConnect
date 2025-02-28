const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  postJob,
  submitJobRequest,
  reviewJobRequest,
  getApprovedJobs,
  getPendingJobs,
} = require("../controllers/jobController");

const router = express.Router();

router.post("/admin/post", protect, admin, postJob); // Only admin can post
router.post("/submit", submitJobRequest); // External users can submit
router.put("/admin/review", protect, admin, reviewJobRequest); //  approves/rejects
router.get("/approved", getApprovedJobs); // Get approved jobs
router.get("/admin/pending", protect, admin, getPendingJobs); //  pending jobs

module.exports = router;
