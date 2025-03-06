const Job = require("../models/Job");

// Create a new job posting - accessible to all users
exports.createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    if (req.user) {
      newJob.postedBy = req.user._id;
    }
    
    const savedJob = await newJob.save();
    res.status(201).json({
      success: true,
      data: savedJob,
      message: "Job posting created successfully and awaiting admin approval"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all job postings - For public view, only shows approved jobs
exports.getPublicJobs = async (req, res) => {
  try {
    const { category, workType, location } = req.query;
    const filters = { status: "approved" }; // Only return approved jobs for public view
    
    // Apply filters if provided
    if (category) filters.category = category;
    if (workType) filters.workType = workType;
    if (location) filters.location = location;
    
    const jobs = await Job.find(filters)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all job postings - Admin view, includes all jobs with their status
exports.getAllJobsAdmin = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const { category, workType, location, status } = req.query;
    const filters = {};
    
    // Apply filters if provided
    if (category) filters.category = category;
    if (workType) filters.workType = workType;
    if (location) filters.location = location;
    if (status) filters.status = status;
    
    const jobs = await Job.find(filters)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single job posting by ID only shows approved jobs
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    // If the job is not approved and the user is not an admin, don't show it
    if (job.status !== "approved" && (!req.user || !req.user.isAdmin)) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not approved yet"
      });
    }
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a job posting - Admin only
exports.updateJob = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedJob,
      message: "Job updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a job posting - Admin only
exports.deleteJob = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    await Job.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update job status (approve/reject) - Admin only
exports.updateJobStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const { status } = req.body;
    
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }
    
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    job.status = status;
    await job.save();
    
    res.status(200).json({
      success: true,
      data: job,
      message: `Job status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get jobs posted by a specific user
exports.getUserJobs = async (req, res) => {
  try {
    // If user is checking their own jobs
    if (req.user && req.user._id.toString() === req.params.userId) {
      const jobs = await Job.find({ postedBy: req.params.userId })
        .sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
      });
    }
    
    // If admin is checking someone else's jobs
    if (req.user && req.user.isAdmin) {
      const jobs = await Job.find({ postedBy: req.params.userId })
        .sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
      });
    }
    
    // If not the user or admin
    return res.status(403).json({
      success: false,
      message: "Access denied."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};