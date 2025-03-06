import React, { useState } from 'react';
import './JobDescription.css';

const JobDescriptionPage = ({ job, onClose, onApply, isAdmin = false }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'Expired';
    if (daysDiff === 0) return 'Last day';
    return `${daysDiff} days remaining`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    });
    
    if (errors.resume) {
      setErrors({
        ...errors,
        resume: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the form data to your backend
      console.log('Submitting application:', formData);
      
      // Call the onApply prop with the form data
      if (onApply) {
        onApply(formData, job._id);
      }
      
      setTimeout(() => {
        setSubmitSuccess(true);
      }, 1000);
    }
  };

  const handleExternalApply = () => {
    // Log that the user clicked on the external application link
    console.log('User clicked external application link for job:', job._id);
    
    // Optional: You could track this event
    if (onApply) {
      onApply({ externalApplication: true }, job._id);
    }
    
    // Open the external form in a new tab
    window.open(job.externalApplicationLink, '_blank');
  };

  const deadlineStatus = calculateDaysRemaining(job.applicationDeadline);
  const isDeadlinePassed = deadlineStatus === 'Expired';
  const hasExternalApplication = job.externalApplicationLink && job.externalApplicationLink.trim().length > 0;

  return (
    <div className="job-description-overlay">
      <div className="job-description-container">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {submitSuccess ? (
          <div className="application-success">
            <div className="success-icon">✓</div>
            <h2>Application Submitted!</h2>
            <p>Thank you for applying to {job.position} at {job.organizationName}.</p>
            <p>The hiring team will review your application and contact you soon.</p>
            <button className="primary-btn" onClick={onClose}>Close</button>
          </div>
        ) : isApplying && !hasExternalApplication ? (
          <div className="application-form-container">
            <h2>Apply for {job.position}</h2>
            <p className="form-subtitle">Complete the form below to submit your application to {job.organizationName}</p>
            
            <form onSubmit={handleSubmit} className="application-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="resume">Resume/CV * (PDF, DOC, DOCX)</label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className={`file-input ${errors.resume ? 'error' : ''}`}
                />
                {errors.resume && <span className="error-message">{errors.resume}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter (Optional)</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Tell us why you're interested in this position..."
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsApplying(false)}>
                  Back to Details
                </button>
                <button type="submit" className="primary-btn">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="job-details-content">
            <div className="job-header">
              <h1>{job.position}</h1>
              <div className="company-details">
                <span className="company-name">{job.organizationName}</span>
                <span className="job-location">{job.location}</span>
              </div>
              
              <div className="job-tags">
                <span className="job-type-tag">{job.workType}</span>
                <span className="job-category-tag">{job.category}</span>
                <span className={`deadline-tag ${isDeadlinePassed ? 'expired' : ''}`}>
                  {isDeadlinePassed ? 'Applications Closed' : 'Apply by ' + formatDate(job.applicationDeadline)}
                </span>
              </div>
            </div>
            
            <div className="job-body">
              <div className="job-summary">
                <div className="summary-item">
                  <h3>Salary Range</h3>
                  <p>{job.salaryRange || 'Not specified'}</p>
                </div>
                <div className="summary-item">
                  <h3>Start Date</h3>
                  <p>{formatDate(job.startingDate)}</p>
                </div>
                <div className="summary-item">
                  <h3>Openings</h3>
                  <p>{job.openings} {job.openings === 1 ? 'position' : 'positions'}</p>
                </div>
                <div className="summary-item">
                  <h3>Employer</h3>
                  <p>{job.employerName}</p>
                </div>
                <div className="summary-item">
                  <h3>Application Deadline</h3>
                  <p>{formatDate(job.applicationDeadline)} ({deadlineStatus})</p>
                </div>
              </div>
              
              <div className="job-section">
                <h2>Job Description</h2>
                <div className="section-content">
                  <p>{job.jobDescription}</p>
                </div>
              </div>
              
              <div className="job-section">
                <h2>Eligibility Criteria</h2>
                <div className="section-content">
                  <p>{job.eligibilityCriteria}</p>
                </div>
              </div>
              
              <div className="job-section">
                <h2>Required Skills</h2>
                <div className="skills-container">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag detail-skill">{skill}</span>
                  ))}
                </div>
              </div>
              
              {job.attachments && job.attachments.length > 0 && (
                <div className="job-section">
                  <h2>Additional Documents</h2>
                  <div className="attachments-container">
                    {job.attachments.map((attachment, index) => (
                      <a key={index} href={attachment} target="_blank" rel="noopener noreferrer" className="attachment-link">
                        Document {index + 1}  <br />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="job-section">
                <h2>About the Company</h2>
                <div className="section-content">
                  <p>
                    {job.organizationName} is a leading company in the {job.category.toLowerCase()} industry.
                  </p>
                  {job.messageForCDC && isAdmin && (
                    <div className="admin-only-section">
                      <h3>Message For CDC</h3>
                      <p>{job.messageForCDC}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="job-footer">
              {!isDeadlinePassed && (
                hasExternalApplication ? (
                  <button 
                    className="apply-button external-apply" 
                    onClick={handleExternalApply}
                  >
                    Apply via External Form
                  </button>
                ) : (
                  <button 
                    className="apply-button" 
                    onClick={() => setIsApplying(true)}
                  >
                    Apply Now
                  </button>
                )
              )}
              <button className="close-details-button" onClick={onClose}>
                Back to Job Listings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionPage;