const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Configure Multer to handle multiple file types
const upload = multer({ storage });

// Define file fields to accept both standard uploads and certification images
const fileFields = [
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 }
];

// Dynamically add certification image fields (will handle up to 10 certifications)
for (let i = 0; i < 10; i++) {
  fileFields.push({ name: `certificationImage-${i}`, maxCount: 1 });
}

module.exports = router;