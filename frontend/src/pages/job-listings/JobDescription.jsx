import React, { useState } from "react";
import "./JobDescription.css";

const JobDescriptionPage = ({ job, onClose, onApply, isAdmin = false }) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyClick = () => {
    setIsApplying(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }
  const handleCloseApplyForm = () => {
    setIsApplying(false);
  };

  return (
    <div className="job-description-overlay">
      <div className="job-description__container">

        {/*  CLOSE BUTTON */}
        <button className="job-description__close-btn" onClick={onClose}>
          &times;
        </button>

        {/*  HEADER: Position + Company Logo + Name */}
        <div className="job-description__header2">
          <h1 className="job-title-head2">{job.profiles}</h1>
          <div className="job-header-details2">
            <img
              src={job.companyLogo} 
              alt="Company Logo"
              className="company-logo"
            />
            <div className="job-header-company2">
              <p className="company-name2">{job.companyName}</p>
              <p className="company-website2">
                <a href={job.website} target="_blank" rel="noreferrer">
                  Visit Website
                </a>
              </p>
            </div>
          </div>
        </div>

        {/*  HIGHLIGHTED DETAILS */}
        <div className="jd-layout">
        <div className="job-description__details2">
          <div className="job-info2">
            <span>💸 CTC/Stipend:</span>
            <p>{job.ctcOrStipend}</p>
          </div>
          <div className="job-info2">
            <span>📌 Location:</span>
            <p>{job.location}</p>
          </div>
          <div className="job-info2">
            <span>🛠 Job Type:</span>
            <p>{job.offerType}</p>
          </div>
          <div className="job-info2">
            <span>📅 Vacancies:</span>
            <p>{job.vacancies}</p>
          </div>
        </div>
       <div className="job-description__details2">
       <div className="job-info2">
       <span>Referred by:</span>
       <p>{job.contactPersonName}</p>
       </div>
       <div className="job-info2">
       <span>Category:</span>
        <p>{job.category.join(', ')}</p>
       </div>
       <div className="job-info2">
       <span>Starting date: </span>
        <p>{formatDate(job.dateOfJoining)}</p>
       </div>

       </div>
        </div>

        {/*  FULL DESCRIPTION */}
        <div className="job-description__body2">
          <h2>Job Description</h2>
          <p>{job.jobDescription}</p>

          <h2>Eligibility Criteria</h2>
          <p>{job.eligibility}</p>

          <h2>Skills Required</h2>
          <div className="job-description__skills2">
            {job.skills && job.skills.map((skill, index) => (
              <span key={index} className="job-description__skill-tag2">
                {skill}
              </span>
            ))}
          </div>

        </div>

        {/*  APPLY BUTTON */}
        <div className="job-description__footer">
          <button className="job-description__apply-btn" onClick={handleApplyClick}>
            Apply Now
          </button>
          <button className="job-description__close-details-btn" onClick={onClose}>
            Back to Job Listings
          </button>
        </div>
      </div>

      {/*  APPLICATION FORM MODAL */}
      {isApplying && (
        <div className="apply-form-overlay">
          <div className="apply-form-container">
            <h2>Apply for {job.profiles}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onApply();
                handleCloseApplyForm();
              }}
            >
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Phone Number" required />
              <input type="file" required />
              <div className="form-actions">
                <button type="submit">Submit Application</button>
                <button type="button" onClick={handleCloseApplyForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionPage;
