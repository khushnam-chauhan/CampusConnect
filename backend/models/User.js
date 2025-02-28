const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },

    // Student Profile Fields
    rollNo: { type: String, unique: true },
    whatsappNo: { type: String },
    fatherName: { type: String },
    fatherNumber: { type: String },
    education: {
      tenth: { percentage: Number, passingYear: Number },
      twelfth: { percentage: Number, passingYear: Number },
      graduation: { degree: String, percentageOrCGPA: Number, passingYear: Number },
      masters: { degree: String, percentageOrCGPA: Number, passingYear: Number },
    },
    existingBacklogs: { type: Number, default: 0 },
    areaOfInterest: [{ type: String }],
    certifications: [{ name: String, image: String }],
    readyToRelocate: { type: Boolean, default: true },
    experience: {
      hasExperience: { type: Boolean, default: false },
      organizationName: { type: String },
      details: { type: String },
    },
    resume: { type: String }, 
    profilePhoto: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
