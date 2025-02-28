const User = require("../models/User");

//  Complete student profile
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateFields = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Get student profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const User = require("../models/User");

//  Upload Resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const filePath = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(userId, { resume: filePath });

    res.status(200).json({ message: "Resume uploaded successfully", filePath });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Upload Profile Photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const filePath = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(userId, { profilePhoto: filePath });

    res.status(200).json({ message: "Profile photo uploaded successfully", filePath });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
