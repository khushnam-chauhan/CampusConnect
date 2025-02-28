const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { completeProfile, getProfile } = require("../controllers/profileController");

const router = express.Router();

router.put("/complete", protect, completeProfile); // Complete or update profile
router.get("/me", protect, getProfile); // user profile

module.exports = router;
