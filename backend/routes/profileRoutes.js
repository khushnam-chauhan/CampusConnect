const express = require("express");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { 
  completeProfile, 
  getProfile,
  uploadProfilePhoto,
  uploadResume
} = require("../controllers/profileController");

const router = express.Router();

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Define file fields for the complete profile endpoint
const fileFields = [
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 }
];

// Dynamically add certification image fields (will handle up to 10 certifications)
for (let i = 0; i < 10; i++) {
  fileFields.push({ name: `certificationImage-${i}`, maxCount: 1 });
}

// Routes
router.put("/complete", protect, upload.fields(fileFields), completeProfile);
router.get("/me", protect, getProfile);
router.post("/upload-photo", protect, upload.single("profilePhoto"), uploadProfilePhoto);
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;