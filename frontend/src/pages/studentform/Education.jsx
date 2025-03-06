import React from 'react';

const EducationSection = ({ formData, handleChange }) => {
  // Helper function to validate percentage input
  const validatePercentage = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      handleChange(e);
    }
  };

  return (
    <>
      <div className="form-group">
        <label>10th % / CGPA</label>
        <input
          type="text"
          name="education.tenth.percentage"
          value={formData.education.tenth.percentage}
          onChange={validatePercentage}
          required
          min="0"
          max="100"
          title="Percentage must be between 0 and 100"
        />
      </div>

      <div className="form-group">
        <label>10th Year of Passing</label>
        <input
          type="text"
          name="education.tenth.passingYear"
          value={formData.education.tenth.passingYear}
          onChange={handleChange}
          required
          pattern="^\d{4}$"
          title="Please enter a valid 4-digit year"
        />
      </div>

      <div className="form-group">
        <label>12th %</label>
        <input
          type="text"
          name="education.twelfth.percentage"
          value={formData.education.twelfth.percentage}
          onChange={validatePercentage}
          required
          min="0"
          max="100"
          title="Percentage must be between 0 and 100"
        />
      </div>

      <div className="form-group">
        <label>12th Year of Passing</label>
        <input
          type="text"
          name="education.twelfth.passingYear"
          value={formData.education.twelfth.passingYear}
          onChange={handleChange}
          required
          pattern="^\d{4}$"
          title="Please enter a valid 4-digit year"
        />
      </div>

      <div className="form-group">
        <label>Graduation Degree</label>
        <input
          type="text"
          name="education.graduation.degree"
          value={formData.education.graduation.degree}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Graduation % or CGPA</label>
        <input
          type="text"
          name="education.graduation.percentageOrCGPA"
          value={formData.education.graduation.percentageOrCGPA}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Graduation Year of Passing</label>
        <input
          type="text"
          name="education.graduation.passingYear"
          value={formData.education.graduation.passingYear}
          onChange={handleChange}
          pattern="^\d{4}$|^$"
          title="Please enter a valid 4-digit year or leave blank"
        />
      </div>

      <div className="form-group">
        <label>Master's Degree</label>
        <input
          type="text"
          name="education.masters.degree"
          value={formData.education.masters.degree}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Master's % or CGPA</label>
        <input
          type="text"
          name="education.masters.percentageOrCGPA"
          value={formData.education.masters.percentageOrCGPA}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Master's Year of Passing</label>
        <input
          type="text"
          name="education.masters.passingYear"
          value={formData.education.masters.passingYear}
          onChange={handleChange}
          pattern="^\d{4}$|^$"
          title="Please enter a valid 4-digit year or leave blank"
        />
      </div>
    </>
  );
};

export default EducationSection;