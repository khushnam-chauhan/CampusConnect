import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./AdminJobs.css";
import AdminJobForm from "./AdminJobForm"; // Import the new component

const AdminJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [currentJob, setCurrentJob] = useState(null);
  
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    profiles: "",
    offerType: "",
    location: "",
    skills: "",
    category: "",
    companyName: ""
  });

  // Debounce function for search/filter
  function debounce(func, wait) {
    let timeout;
    const debounced = (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
    debounced.cancel = () => clearTimeout(timeout);
    return debounced;
  }

  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const apiParams = {};
      if (params.status && params.status !== "all") apiParams.status = params.status;
      if (params.profiles) apiParams.profiles = params.profiles;
      if (params.offerType) apiParams.offerType = params.offerType;
      if (params.location) apiParams.location = params.location;
      if (params.skills) apiParams.skills = params.skills;
      if (params.category) apiParams.category = params.category;
      if (params.companyName) apiParams.companyName = params.companyName;
      
      // Add search parameter for general text search
      if (params.search && params.search.trim() !== "") {
        apiParams.search = params.search.trim();
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobs/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: apiParams
      });
      
      setJobs(response.data.data || response.data);
      setError(null);
      setSelectedJobs([]);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load jobs: ${err.response?.data?.message || err.message}`);
      setJobs([]);
      setLoading(false);
      console.error("Error fetching jobs:", err);
    }
  };

  // Job status update API call
  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch (err) {
      console.error(`Error ${newStatus} job:`, err);
      throw new Error(err.response?.data?.message || `Failed to ${newStatus} job`);
    }
  };

  // API call to delete a job
  const deleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (err) {
      console.error("Error deleting job:", err);
      throw new Error(err.response?.data?.message || "Failed to delete job");
    }
  };

  // Load jobs based on current filters
  const loadJobs = useCallback(async () => {
    await fetchJobs({
      status: filters.status,
      profiles: filters.profiles,
      offerType: filters.offerType,
      location: filters.location,
      skills: filters.skills,
      category: filters.category,
      companyName: filters.companyName,
      search: filters.search
    });
  }, [filters]);

  // Debounced version of loadJobs
  const debouncedLoadJobs = useCallback(
    debounce(() => loadJobs(), 500),
    [loadJobs]
  );

  // Effect for initial load and filter changes
  useEffect(() => {
    if (filters.status !== "all") {
      loadJobs();
    } else {
      debouncedLoadJobs();
    }
    
    return () => debouncedLoadJobs.cancel();
  }, [filters, debouncedLoadJobs, loadJobs]);

  // Sorting logic
  const sortJobs = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedJobs = [...jobs].sort((a, b) => {
      if (!a[key] && !b[key]) return 0;
      if (!a[key]) return direction === "asc" ? 1 : -1;
      if (!b[key]) return direction === "asc" ? -1 : 1;
      
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    
    setJobs(sortedJobs);
  };

  // Filter handling
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      search: "",
      profiles: "",
      offerType: "",
      location: "",
      skills: "",
      category: "",
      companyName: ""
    });
  };

  // Job selection for bulk actions
  const handleSelectJob = (jobId) => {
    setSelectedJobs(
      selectedJobs.includes(jobId)
        ? selectedJobs.filter(id => id !== jobId)
        : [...selectedJobs, jobId]
    );
  };

  const handleSelectAll = () => {
    setSelectedJobs(
      selectedJobs.length === jobs.length ? [] : jobs.map(job => job._id)
    );
  };

  // Job actions
  const handleApprove = async (jobId) => {
    try {
      await updateJobStatus(jobId, "approved");
      setJobs(jobs.map(job => (job._id === jobId ? { ...job, status: "approved" } : job)));
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
      setError(null);
    } catch (err) {
      setError(`Failed to approve job: ${err.message}`);
    }
  };

  const handleReject = async (jobId) => {
    try {
      await updateJobStatus(jobId, "rejected");
      setJobs(jobs.map(job => (job._id === jobId ? { ...job, status: "rejected" } : job)));
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
      setError(null);
    } catch (err) {
      setError(`Failed to reject job: ${err.message}`);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        await deleteJob(jobId);
        setJobs(jobs.filter(job => job._id !== jobId));
        setSelectedJobs(selectedJobs.filter(id => id !== jobId));
        setError(null);
      } catch (err) {
        setError(`Failed to delete job: ${err.message}`);
      }
    }
  };

  // Bulk actions
  const handleBulkApprove = async () => {
    if (window.confirm(`Are you sure you want to approve ${selectedJobs.length} jobs?`)) {
      try {
        await Promise.all(selectedJobs.map(id => updateJobStatus(id, "approved")));
        setJobs(
          jobs.map(job => (selectedJobs.includes(job._id) ? { ...job, status: "approved" } : job))
        );
        setSelectedJobs([]);
        setError(null);
      } catch (err) {
        setError(`Failed to approve some jobs: ${err.message}`);
      }
    }
  };

  const handleBulkReject = async () => {
    if (window.confirm(`Are you sure you want to reject ${selectedJobs.length} jobs?`)) {
      try {
        await Promise.all(selectedJobs.map(id => updateJobStatus(id, "rejected")));
        setJobs(
          jobs.map(job => (selectedJobs.includes(job._id) ? { ...job, status: "rejected" } : job))
        );
        setSelectedJobs([]);
        setError(null);
      } catch (err) {
        setError(`Failed to reject some jobs: ${err.message}`);
      }
    }
  };

  // Toggle job details view
  const toggleJobDetails = (jobId) => {
    setActiveJobId(activeJobId === jobId ? null : jobId);
  };

  // Modal controls
  const openCreateModal = () => {
    setCurrentJob(null);
    setFormMode("create");
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setCurrentJob(job);
    setFormMode("edit");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentJob(null);
  };

  // Handle form submission results
  const handleFormSubmit = (jobData, mode) => {
    if (mode === "create") {
      setJobs([jobData, ...jobs]);
    } else {
      setJobs(jobs.map(job => job._id === jobData._id ? jobData : job));
    }
    closeModal();
  };

  return (
    <div className="admin-job-management">
      <h1>Job Management Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="control-panel">
        <button className="create-button" onClick={openCreateModal}>
          Add New Job
        </button>
        
        <div className="filter-controls">
          <div className="filter-row">
            <label>
              Status:
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="all">All Jobs</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <label>
              Profile:
              <input
                type="text"
                name="profiles"
                value={filters.profiles}
                onChange={handleFilterChange}
                placeholder="Filter by profile"
              />
            </label>

            <label>
              Company:
              <input
                type="text"
                name="companyName"
                value={filters.companyName}
                onChange={handleFilterChange}
                placeholder="Filter by company"
              />
            </label>
          </div>
          
          <div className="filter-row">
          <label>
                Offer Type:
                <select name="offerType" value={filters.offerType} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="Full time Employment">Full time Employment</option>
                  <option value="Internship + PPO">Internship + PPO</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                  <option value="Summer Internship">Summer Internship</option>
                </select>
              </label>

              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Filter by location"
                />
              </label>

              <div className="search-form">
                <input
                  type="text"
                  name="search"
                  placeholder="Search any keyword..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={loadJobs} className="refresh-button">
                Refresh
              </button>
              <button onClick={handleClearFilters} className="clear-button">
                Clear Filters
              </button>
            </div>
          </div>

          {selectedJobs.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedJobs.length} selected</span>
              <button onClick={handleBulkApprove} className="approve-button">
                Approve Selected
              </button>
              <button onClick={handleBulkReject} className="reject-button">
                Reject Selected
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="no-items">No jobs found matching your criteria.</div>
        ) : (
          <div className="job-list">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === jobs.length && jobs.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th onClick={() => sortJobs("companyName")}>
                    Company
                    {sortConfig.key === "companyName" && (
                      <span className="sort-indicator">{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th onClick={() => sortJobs("profiles")}>
                    Profile
                    {sortConfig.key === "profiles" && (
                      <span className="sort-indicator">{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th onClick={() => sortJobs("offerType")}>
                    Offer Type
                    {sortConfig.key === "offerType" && (
                      <span className="sort-indicator">{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th onClick={() => sortJobs("location")}>
                    Location
                    {sortConfig.key === "location" && (
                      <span className="sort-indicator">{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th onClick={() => sortJobs("createdAt")}>
                    Posted Date
                    {sortConfig.key === "createdAt" && (
                      <span className="sort-indicator">{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th onClick={() => sortJobs("status")}>
                    Status
                    {sortConfig.key === "status" && (
                      <span className="sort-indicator">{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <React.Fragment key={job._id}>
                    <tr className={`job-row ${job.status}`}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job._id)}
                          onChange={() => handleSelectJob(job._id)}
                        />
                      </td>
                      <td>
                        <div className="company-info">
                          {job.companyLogo && (
                            <img 
                              src={job.companyLogo} 
                              alt={`${job.companyName} logo`} 
                              className="company-logo-small" 
                            />
                          )}
                          <span>{job.companyName}</span>
                        </div>
                      </td>
                      <td>{job.profiles}</td>
                      <td>{job.offerType}</td>
                      <td>{job.location}</td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${job.status}`}>{job.status}</span>
                      </td>
                      <td className="action-buttons">
                        <button onClick={() => toggleJobDetails(job._id)} className="details-button">
                          {activeJobId === job._id ? "Hide" : "View"}
                        </button>
                        <button onClick={() => openEditModal(job)} className="edit-button">
                          Edit
                        </button>
                        {job.status === "pending" && (
                          <>
                            <button onClick={() => handleApprove(job._id)} className="approve-button">
                              Approve
                            </button>
                            <button onClick={() => handleReject(job._id)} className="reject-button">
                              Reject
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDelete(job._id)} className="delete-button">
                          Delete
                        </button>
                      </td>
                    </tr>
                    {activeJobId === job._id && (
                      <tr className="details-row">
                        <td colSpan="8">
                          <div className="job-details">
                            <div className="detail-section">
                              <h4>Company Information</h4>
                              <div className="detail-grid">
                                <div>
                                  <p>
                                    <strong>Company Name:</strong> {job.companyName}
                                  </p>
                                  <p>
                                    <strong>Office Address:</strong> {job.officeAddress}
                                  </p>
                                  <p>
                                    <strong>Website:</strong>{" "}
                                    <a href={job.website} target="_blank" rel="noopener noreferrer">
                                      {job.website}
                                    </a>
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Year of Establishment:</strong> {job.yearOfEstablishment}
                                  </p>
                                  <p>
                                    <strong>Contact Person:</strong> {job.contactPersonName}
                                  </p>
                                  <p>
                                    <strong>Contact Number:</strong> {job.contactNumber}
                                  </p>
                                  <p>
                                    <strong>Email:</strong> {job.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Job Details</h4>
                              <div className="detail-grid">
                                <div>
                                  <p>
                                    <strong>Profile:</strong> {job.profiles}
                                  </p>
                                  <p>
                                    <strong>Offer Type:</strong> {job.offerType}
                                  </p>
                                  <p>
                                    <strong>CTC/Stipend:</strong> {job.ctcOrStipend}
                                  </p>
                                  <p>
                                    <strong>Location:</strong> {job.location}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Vacancies:</strong> {job.vacancies}
                                  </p>
                                  <p>
                                    <strong>Result Declaration:</strong> {job.resultDeclaration}
                                  </p>
                                  <p>
                                    <strong>Date of Joining:</strong> {new Date(job.dateOfJoining).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <strong>Posted By:</strong> {job.postedBy}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Requirements</h4>
                              <div className="detail-grid">
                                <div>
                                  <p>
                                    <strong>Eligibility:</strong> {job.eligibility}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Reference:</strong> {job.reference}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Skills</h4>
                              <div className="tag-container">
                                {job.skills && job.skills.map((skill, index) => (
                                  <span key={index} className="tag skill-tag">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Categories</h4>
                              <div className="tag-container">
                                {job.category && job.category.map((cat, index) => (
                                  <span key={index} className="tag category-tag">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Job Description</h4>
                              <p>{job.jobDescription}</p>
                            </div>

                            {job.additionalInfo && (
                              <div className="detail-section">
                                <h4>Additional Information</h4>
                                <p>{job.additionalInfo}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Job Create/Edit Modal */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{formMode === "create" ? "Create New Job" : "Edit Job"}</h2>
                <button className="close-button" onClick={closeModal}>×</button>
              </div>
              
              <AdminJobForm 
                formMode={formMode}
                initialData={currentJob}
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        )}
      </div>
    );
};

export default AdminJobManagement;