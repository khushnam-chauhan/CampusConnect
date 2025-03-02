const User = require("../models/User");

// Get student profile - Fixed to ensure proper field mapping for the frontend
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map the user object to ensure all fields match the frontend's expectations
    const mappedUser = {
      _id: user._id,
      fullName: user.fullName || "",
      email: user.email || "",
      rollNo: user.rollNo || "",
      mobileNo: user.mobileNo || "", // Ensure this field is properly sent to frontend
      whatsappNo: user.whatsappNo || "",
      mailId: user.mailId || "",
      fatherName: user.fatherName || "",
      fatherNumber: user.fatherNumber || "",
      school: user.school || "",
      existingBacklogs: user.existingBacklogs || "",
      areaOfInterest: user.areaOfInterest || "", // Ensure this field is properly sent to frontend
      readyToRelocate: user.readyToRelocate || false,
      education: user.education || {
        tenth: { percentage: "", passingYear: "" },
        twelfth: { percentage: "", passingYear: "" },
        graduation: { degree: "", percentageOrCGPA: "", passingYear: "" },
        masters: { degree: "", percentageOrCGPA: "", passingYear: "" },
      },
      certifications: user.certifications || [],
      experience: user.experience || {
        hasExperience: false,
        organizationName: "",
        duration: "",
        details: "",
      },
      profilePhoto: user.profilePhoto || null,
      resume: user.resume || null,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(mappedUser);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Complete student profile
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Parse JSON strings from form data
    let updateFields = { ...req.body };

    // Handle nested JSON objects
    if (updateFields.education) {
      try {
        updateFields.education = JSON.parse(updateFields.education);
      } catch (err) {
        console.error("Error parsing education data:", err);
      }
    }

    if (updateFields.experience) {
      try {
        updateFields.experience = JSON.parse(updateFields.experience);
      } catch (err) {
        console.error("Error parsing experience data:", err);
      }
    }

    if (updateFields.certifications) {
      try {
        updateFields.certifications = JSON.parse(updateFields.certifications);
      } catch (err) {
        console.error("Error parsing certifications data:", err);
      }
    }

    // Convert checkbox values to booleans
    if (updateFields.readyToRelocate) {
      updateFields.readyToRelocate = updateFields.readyToRelocate === "true";
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePhoto) {
        updateFields.profilePhoto = `/uploads/${req.files.profilePhoto[0].filename}`;
      }
      
      if (req.files.resume) {
        updateFields.resume = `/uploads/${req.files.resume[0].filename}`;
      }
      
      // Handle certification images
      if (updateFields.certifications && Array.isArray(updateFields.certifications)) {
        for (let i = 0; i < updateFields.certifications.length; i++) {
          const certFileKey = `certificationImage-${i}`;
          if (req.files[certFileKey]) {
            updateFields.certifications[i].image = `/uploads/${req.files[certFileKey][0].filename}`;
          }
        }
      }
    }

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
    console.error("Error in completeProfile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload Profile Photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const filePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId, 
      { profilePhoto: filePath }, 
      { new: true }
    );

    res.status(200).json({ message: "Profile photo uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload Resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const filePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId, 
      { resume: filePath }, 
      { new: true }
    );

    res.status(200).json({ message: "Resume uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};