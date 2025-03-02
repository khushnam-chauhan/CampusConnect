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

// Update Student Profile
router.post("/update-profile", protect, upload.fields(fileFields), async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Extract and parse JSON fields
    let educationData, experienceData, certificationsData;
    
    try {
      if (req.body.education) {
        educationData = JSON.parse(req.body.education);
      }
      
      if (req.body.experience) {
        experienceData = JSON.parse(req.body.experience);
      }
      
      if (req.body.certifications) {
        certificationsData = JSON.parse(req.body.certifications);
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON data in request" });
    }

    // Create the update object
    const updateFields = {
      fullName: req.body.fullName,
      email: req.body.email,
      rollNo: req.body.rollNo,
      mobileNo: req.body.mobileNo,
      whatsappNo: req.body.whatsappNo,
      mailId: req.body.mailId,
      fatherName: req.body.fatherName,
      fatherNumber: req.body.fatherNumber,
      school: req.body.school,
      existingBacklogs: req.body.existingBacklogs,
      areaOfInterest: req.body.areaOfInterest,
      readyToRelocate: req.body.readyToRelocate === "true"
    };

    // Add education data if available
    if (educationData) {
      updateFields.education = educationData;
    }

    // Add experience data if available
    if (experienceData) {
      updateFields.experience = experienceData;
    }

    // Handle file uploads for profile photo and resume
    if (req.files) {
      if (req.files.profilePhoto) {
        updateFields.profilePhoto = `/uploads/${req.files.profilePhoto[0].filename}`;
      }
      
      if (req.files.resume) {
        updateFields.resume = `/uploads/${req.files.resume[0].filename}`;
      }
    }

    // Process certification data and images
    if (certificationsData) {
      const processedCertifications = [];

      for (let i = 0; i < certificationsData.length; i++) {
        const cert = { name: certificationsData[i].name };

        // Keep existing image if available
        if (certificationsData[i].image) {
          cert.image = certificationsData[i].image;
        }

        // Check if there's a new certification image
        if (req.files && req.files[`certificationImage-${i}`]) {
          cert.image = `/uploads/${req.files[`certificationImage-${i}`][0].filename}`;
        }

        processedCertifications.push(cert);
      }

      updateFields.certifications = processedCertifications;
    }

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateFields, 
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;