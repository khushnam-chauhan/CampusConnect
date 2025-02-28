const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadResume, uploadProfilePhoto } = require("../controllers/profileController");

const router = express.Router();

router.post("/resume", protect, upload.single("resume"), uploadResume);
router.post("/profile-photo", protect, upload.single("profilePhoto"), uploadProfilePhoto);

module.exports = router;
