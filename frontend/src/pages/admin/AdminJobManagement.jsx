import React, { useState, useEffect } from 'react';
import './AdminJobManagement.css';

const AdminJobManagement = ({ fetchJobs, approveJob, rejectJob, deleteJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeJobId, setActiveJobId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, [statusFilter]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await fetchJobs(statusFilter !== 'all' ? statusFilter : null);
      setJobs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await approveJob(jobId);
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, status: 'approved' } : job
      ));
    } catch (err) {
      setError('Failed to approve job.');
      console.error(err);
    }
  };

  const handleReject = async (jobId) => {
    try {
      await rejectJob(jobId);
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, status: 'rejected' } : job
      ));
    } catch (err) {
      setError('Failed to reject job.');
      console.error(err);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      try {
        await deleteJob(jobId);
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (err) {
        setError('Failed to delete job.');
        console.error(err);
      }
    }
  };

  const toggleJobDetails = (jobId) => {
    setActiveJobId(activeJobId === jobId ? null : jobId);
  };

  return (
    <div className="admin-job-management">
      <h2>Job Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="filter-controls">
        <label>
          Filter by status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Jobs</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <button onClick={loadJobs} className="refresh-button">Refresh</button>
      </div>

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="no-jobs">No jobs found.</div>
      ) : (
        <div className="job-list">
          {jobs.map(job => (
            <div key={job._id} className={`job-card ${job.status}`}>
              <div className="job-card-header">
                <div className="job-title-section">
                  <h3 className="job-title">{job.position}</h3>
                  <span className="job-company">{job.organizationName}</span>
                </div>
                <div className="job-status-section">
                  <span className={`status-badge ${job.status}`}>{job.status}</span>
                  <button onClick={() => toggleJobDetails(job._id)} className="details-toggle">
                    {activeJobId === job._id ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
              </div>
              
              <div className="job-card-summary">
                <div className="job-info">
                  <span className="job-location">{job.location}</span>
                  <span className="job-work-type">{job.workType}</span>
                  <span className="job-date">Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {activeJobId === job._id && (
                <div className="job-details">
                  <div className="job-detail-section">
                    <h4>Company Information</h4>
                    <p><strong>Employer:</strong> {job.employerName}</p>
                    <p><strong>Email:</strong> {job.email}</p>
                    <p><strong>Contact:</strong> {job.contactNumber}</p>
                    {job.whatsappNumber && <p><strong>WhatsApp:</strong> {job.whatsappNumber}</p>}
                  </div>
                  
                  <div className="job-detail-section">
                    <h4>Job Details</h4>
                    <p><strong>Category:</strong> {job.category}</p>
                    <p><strong>Salary Range:</strong> {job.salaryRange || 'Not specified'}</p>
                    <p><strong>Openings:</strong> {job.openings}</p>
                    <p><strong>Start Date:</strong> {new Date(job.startingDate).toLocaleDateString()}</p>
                    <p><strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="job-detail-section">
                    <h4>Eligibility Criteria</h4>
                    <p>{job.eligibilityCriteria}</p>
                  </div>
                  
                  <div className="job-detail-section">
                    <h4>Job Description</h4>
                    <p>{job.jobDescription}</p>
                  </div>
                  
                  <div className="job-detail-section">
                    <h4>Required Skills</h4>
                    <div className="skill-tags">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  {job.socialLinks && job.socialLinks.length > 0 && (
                    <div className="job-detail-section">
                      <h4>Social Links</h4>
                      <ul className="social-links">
                        {job.socialLinks.map((link, index) => (
                          <li key={index}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.messageForCDC && (
                    <div className="job-detail-section">
                      <h4>Message for CDC</h4>
                      <p>{job.messageForCDC}</p>
                    </div>
                  )}
                  
                  {job.externalApplicationLink && (
                    <div className="job-detail-section">
                      <h4>External Application Link</h4>
                      <a href={job.externalApplicationLink} target="_blank" rel="noopener noreferrer">
                        {job.externalApplicationLink}
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              <div className="job-card-actions">
                {job.status === 'pending' && (
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJobManagement;