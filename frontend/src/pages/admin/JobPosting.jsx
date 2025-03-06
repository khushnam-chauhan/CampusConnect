import React, { useState } from 'react';
import './JobPostForm.css';
import Navbar from '../../layouts/Navbar';

const JobPostForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    employerName: '',
    contactNumber: '',
    organizationName: '',
    whatsappNumber: '',
    email: '',
    position: '',
    startingDate: '',
    applicationDeadline: '',
    salaryRange: '',
    openings: 1,
    location: '',
    workType: 'Full-time',
    category: '',
    eligibilityCriteria: '',
    jobDescription: '',
    skills: '',
    socialLinks: '',
    messageForCDC: '',
    externalApplicationLink: '',
  });

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'employerName', 'contactNumber', 'organizationName', 'email', 
      'position', 'startingDate', 'applicationDeadline', 
      'location', 'workType', 'category', 'eligibilityCriteria', 
      'jobDescription', 'skills', 'socialLinks'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
    setSubmitMessage('');
  
    try {
      const processedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        socialLinks: formData.socialLinks.split(',').map(link => link.trim()).filter(Boolean),
        openings: parseInt(formData.openings)
      };
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSubmitMessage('Job posting submitted successfully and awaiting admin approval');
        setFormData({
          employerName: '',
          contactNumber: '',
          organizationName: '',
          whatsappNumber: '',
          email: '',
          position: '',
          startingDate: '',
          applicationDeadline: '',
          salaryRange: '',
          openings: 1,
          location: '',
          workType: 'Full-time',
          category: '',
          eligibilityCriteria: '',
          jobDescription: '',
          skills: '',
          socialLinks: '',
          messageForCDC: '',
          externalApplicationLink: '',
        });
        setAttachments([]);
      } else {
        throw new Error(result.message || 'Failed to submit job posting');
      }
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
    <Navbar/>
        <div className="job-post-form-container">
      <h2>Post a New Job</h2>
      <p className="form-notice">All job postings require admin approval before being displayed publicly.</p>
      
      {submitMessage && (
        <div className={`form-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
          {submitMessage}
        </div>
      )}
      
      <form className="job-post-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Company Information</h3>
          
          <div className="form-group">
            <label htmlFor="employerName">Employer Name *</label>
            <input
              type="text"
              id="employerName"
              name="employerName"
              value={formData.employerName}
              onChange={handleChange}
              className={errors.employerName ? 'error' : ''}
            />
            {errors.employerName && <span className="error-message">{errors.employerName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="organizationName">Organization Name *</label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className={errors.organizationName ? 'error' : ''}
            />
            {errors.organizationName && <span className="error-message">{errors.organizationName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={errors.contactNumber ? 'error' : ''}
              />
              {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="whatsappNumber">WhatsApp Number</label>
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="socialLinks">Social Links (comma separated) *</label>
            <input
              type="text"
              id="socialLinks"
              name="socialLinks"
              value={formData.socialLinks}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/example, https://twitter.com/example"
              className={errors.socialLinks ? 'error' : ''}
            />
            {errors.socialLinks && <span className="error-message">{errors.socialLinks}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Job Details</h3>
          
          <div className="form-group">
            <label htmlFor="position">Position *</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={errors.position ? 'error' : ''}
            />
            {errors.position && <span className="error-message">{errors.position}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Engineering, Marketing, Finance"
              className={errors.category ? 'error' : ''}
            />
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="workType">Work Type *</label>
              <select
                id="workType"
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className={errors.workType ? 'error' : ''}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
              {errors.workType && <span className="error-message">{errors.workType}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startingDate">Starting Date *</label>
              <input
                type="date"
                id="startingDate"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleChange}
                className={errors.startingDate ? 'error' : ''}
              />
              {errors.startingDate && <span className="error-message">{errors.startingDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="applicationDeadline">Application Deadline *</label>
              <input
                type="date"
                id="applicationDeadline"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className={errors.applicationDeadline ? 'error' : ''}
              />
              {errors.applicationDeadline && <span className="error-message">{errors.applicationDeadline}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryRange">Salary Range</label>
              <input
                type="text"
                id="salaryRange"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g. $80,000 - $100,000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="openings">Number of Openings</label>
              <input
                type="number"
                id="openings"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="eligibilityCriteria">Eligibility Criteria *</label>
            <textarea
              id="eligibilityCriteria"
              name="eligibilityCriteria"
              value={formData.eligibilityCriteria}
              onChange={handleChange}
              className={errors.eligibilityCriteria ? 'error' : ''}
              rows="3"
            ></textarea>
            {errors.eligibilityCriteria && <span className="error-message">{errors.eligibilityCriteria}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription">Job Description *</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              className={errors.jobDescription ? 'error' : ''}
              rows="6"
            ></textarea>
            {errors.jobDescription && <span className="error-message">{errors.jobDescription}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="skills">Required Skills (comma separated) *</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, NodeJS"
              className={errors.skills ? 'error' : ''}
            />
            {errors.skills && <span className="error-message">{errors.skills}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="externalApplicationLink">External Application Link</label>
            <input
              type="text"
              id="externalApplicationLink"
              name="externalApplicationLink"
              value={formData.externalApplicationLink}
              onChange={handleChange}
              placeholder="https://company.com/careers/job"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          
          <div className="form-group">
            <label htmlFor="messageForCDC">Message for CDC</label>
            <textarea
              id="messageForCDC"
              name="messageForCDC"
              value={formData.messageForCDC}
              onChange={handleChange}
              placeholder="Any additional information for the Career Development Center"
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="externalApplicationLink">External Link for Hiring </label>
            <textarea
              id="externalApplicationLink"
              name="externalLink"
              value={formData.externalApplicationLink}
              onChange={handleChange}
              placeholder="Any external link for hiring process like googleForms "
            
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              onChange={handleFileChange}
              multiple
              className="file-input"
            />
            <small className="form-text">Upload job description, company brochure, etc. (Max 5MB per file)</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Job Posting'}
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default JobPostForm;