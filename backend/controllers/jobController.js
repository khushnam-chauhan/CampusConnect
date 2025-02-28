const Job = require("../models/Job");

// @desc Admin posts a job (direct approval)
exports.postJob = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can post jobs" });
    }

    const job = new Job({ ...req.body, status: "approved", postedBy: req.user._id });
    await job.save();

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc External users submit jobs (Admin approval required)
exports.submitJobRequest = async (req, res) => {
  try {
    const job = new Job({ ...req.body, status: "pending", postedBy: null });
    await job.save();

    res.status(201).json({ message: "Job request submitted. Awaiting admin approval.", job });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Admin approves/rejects job requests
exports.reviewJobRequest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can review job requests" });
    }

    const { jobId, status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await Job.findByIdAndUpdate(jobId, { status }, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: `Job ${status} successfully`, job });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Get all approved jobs
exports.getApprovedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "approved" });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc Get all pending jobs (For admin review)
exports.getPendingJobs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view pending jobs" });
    }

    const jobs = await Job.find({ status: "pending" });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
