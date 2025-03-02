const express = require("express");
const multer = require("multer");
const { uploadProfilePhoto, uploadResume } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Routes
router.post("/profile-photo", protect, upload.single("profilePhoto"), uploadProfilePhoto);
router.post("/resume", protect, upload.single("resume"), uploadResume);

module.exports = router;
