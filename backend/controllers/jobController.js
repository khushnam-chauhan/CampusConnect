const Job = require("../models/Job");

// Create a job posting
exports.createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json({
      success: true,
      data: savedJob,
      message: "Job created successfully, pending admin approval"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get approved jobs (public view)
exports.getPublicJobs = async (req, res) => {
  try {
    const { profiles, offerType, location, skills, category } = req.query;
    const filters = { status: "approved" };

    if (profiles) filters.profiles = profiles;
    if (offerType) filters.offerType = offerType;
    if (location) filters.location = location;
    if (skills) {
      const skillsArray = skills.split(',').map(skill => new RegExp(skill.trim(), 'i'));
      filters.skills = { $in: skillsArray };
    }
    if (category) {
      const categoryArray = category.split(',').map(cat => cat.trim());
      filters.category = { $in: categoryArray };
    }

    const jobs = await Job.find(filters).sort({ createdAt: -1 });
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
exports.getAllJobsAdmin = async(req, res) => {
  try {
    // Check for admin privileges
    if(req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }
    
    const {profiles, offerType, location, status, skills, category, search, companyName} = req.query;
    const filters = {};
    
    // Basic filters with case-insensitive matching
    if(status && status !== 'all') filters.status = status;
    if(offerType) filters.offerType = offerType;
    if(location) filters.location = new RegExp(location, 'i'); // Make location search case-insensitive
    if(companyName) filters.companyName = new RegExp(companyName, 'i'); // Add direct company name filter
    
    // Handle search parameter
    if(search) {
      const searchRegex = new RegExp(search, 'i');
      filters.$or = [
        { companyName: searchRegex },
        { profiles: searchRegex },
        { postedBy: searchRegex },
        { location: searchRegex } // Also search in location field
      ];
      
      // Try to match ID if the search looks like a valid MongoDB ObjectId
      if(search.match(/^[0-9a-fA-F]{24}$/)) {
        filters.$or.push({ _id: search });
      }
    } else {
      // Only apply these filters if no search term is provided
      if(profiles) filters.profiles = new RegExp(profiles, 'i');
    }
    
    // Handle skills filtering (if skills is a comma-separated string)
    if(skills) {
      const skillsArray = skills.split(',').map(skill => new RegExp(skill.trim(), 'i'));
      filters.skills = { $in: skillsArray };
    }
    
    // Handle category filtering (if category is a comma-separated string)
    if(category) {
      const categoryArray = category.split(',').map(cat => cat.trim());
      filters.category = { $in: categoryArray };
    }


    const jobs = await Job.find(filters).sort({createdAt: -1});
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get a single job posting by ID only shows approved jobs
exports.getJobById = async(req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if(!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    if(job.status != "approved" && (!req.user || !req.user.isAdmin)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only approved jobs can be viewed."
      });
    }
    res.status(200).json({
      success: true,
      data: job
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a job posting - Admin only
exports.updateJob = async (req, res) => {
  try {
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

// Get jobs posted by a specific contact person or reference
exports.getJobsByPostedBy = async (req, res) => {
  try {
    const { postedBy } = req.params;
    const { skills, category } = req.query;
    const filters = { postedBy };
    
    // Add skills filter if provided
    if(skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filters.skills = { $in: skillsArray };
    }
    
    // Add category filter if provided
    if(category) {
      const categoryArray = category.split(',').map(cat => cat.trim());
      filters.category = { $in: categoryArray };
    }
    
    if (req.user && req.user.isAdmin) {
      const jobs = await Job.find(filters)
        .sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
      });
    }
    
    filters.status = "approved";
    const jobs = await Job.find(filters).sort({ createdAt: -1 });
    
    return res.status(200).json({
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

// New endpoint to search jobs by skills
exports.searchJobsBySkills = async (req, res) => {
  try {
    const { skills } = req.query;
    if (!skills) {
      return res.status(400).json({
        success: false,
        message: "Skills parameter is required"
      });
    }

    const skillsArray = skills.split(',').map(skill => new RegExp(skill.trim(), 'i'));
    const filters = {
      skills: { $in: skillsArray },
      status: "approved"
    };

    if (req.user && req.user.isAdmin) {
      delete filters.status;
    }

    const jobs = await Job.find(filters).sort({ createdAt: -1 });
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
// New endpoint to search jobs by category
exports.searchJobsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required"
      });
    }

    const categoryArray = category.split(',').map(cat => cat.trim());
    const filters = {
      category: { $in: categoryArray },
      status: "approved"
    };

    // If admin, allow searching for unapproved jobs too
    if (req.user && req.user.isAdmin) {
      delete filters.status;
    }
    
    const jobs = await Job.find(filters).sort({ createdAt: -1 });
    
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