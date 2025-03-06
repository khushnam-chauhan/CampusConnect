import React, { useState } from 'react';
import './JobListing.css';
import JobDescriptionPage from './JobDescription';

const JobCard = ({ job }) => {
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [applyDirectly, setApplyDirectly] = useState(false);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'Expired';
    if (daysDiff === 0) return 'Last day';
    return `${daysDiff} days left`;
  };

  const handleDetailsClick = () => {
    setShowJobDescription(true);
    setApplyDirectly(false);
  };

  const handleApplyClick = () => {
    setShowJobDescription(true);
    setApplyDirectly(true);
  };

  const handleCloseJobDescription = () => {
    setShowJobDescription(false);
  };

  return (
    <>
      <div className="job-card">
        <div className="job-card-header">
          <h3 className="job-title">{job.position}</h3>
        </div>
        
        <div className="job-company">
          <span>{job.organizationName}</span>
          <span className="job-location">{job.location}</span>
        </div>
        
        <div className="job-meta">
          <span className="job-type">{job.workType}</span>
          <span className="job-category">{job.category}</span>
        </div>
        
        <div className="job-deadline">
          Apply by: {formatDate(job.applicationDeadline)}
          <span className="days-remaining">{calculateDaysRemaining(job.applicationDeadline)}</span>
        </div>
        
        <div className="job-skills">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-badge">{skill}</span>
          ))}
          {job.skills.length > 3 && <span className="more-skills">+{job.skills.length - 3}</span>}
        </div>
        
        <div className="job-card-footer">
          <button className="view-details-btn" onClick={handleDetailsClick}>Details</button>
          <button 
            className="apply-now-btn" 
            onClick={handleApplyClick}
            disabled={calculateDaysRemaining(job.applicationDeadline) === 'Expired'}
          >
            Apply
          </button>
        </div>
      </div>

      {showJobDescription && (
        <JobDescriptionPage 
          job={job} 
          onClose={handleCloseJobDescription} 
          onApply={handleApplyClick} 
          initiallyApplying={applyDirectly}
        />
      )}
    </>
  );
};

export default JobCard;