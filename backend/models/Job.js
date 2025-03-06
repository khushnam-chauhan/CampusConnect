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
    applicationDeadline: { type: Date, required: true },
    salaryRange: { type: String },
    openings: { type: Number, default: 1 },
    location: { type: String, required: true },
    workType: { type: String, enum: ["Full-time", "Part-time", "Internship"], required: true },
    category: { type: String, required: true }, 
    eligibilityCriteria: { type: String, required: true },
    jobDescription: { type: String, required: true },
    skills: [{ type: String, required: true }],
    socialLinks: [{ type: String, required:true }],
    messageForCDC: { type: String },
    attachments: [{ type: String }], 
    externalApplicationLink: { type: String }, 
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);