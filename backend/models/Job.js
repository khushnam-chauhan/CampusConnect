const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    employerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    organizationName: { type: String, required: true },
    whatsappNumber: { type: String },
    email: { type: String, required: true },
    position: { type: String, required: true },
    startingDate: { type: Date, required: true },
    applicationDeadline: { type: Date, required: true }, // Added application deadline
    salaryRange: { type: String },
    openings: { type: Number, default: 1 },
    location: { type: String, required: true },
    workType: { type: String, enum: ["Full-time", "Part-time", "Internship"], required: true },
    category: { type: String, required: true }, // Added job category
    eligibilityCriteria: { type: String, required: true },
    jobDescription: { type: String, required: true },
    skills: [{ type: String, required: true }],
    socialLinks: [{ type: String }],
    messageForCDC: { type: String },
    attachments: [{ type: String }], // File URLs if any
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Null for external users
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);