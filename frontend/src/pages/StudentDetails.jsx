import { useState } from "react";
import "./studentDetails.css";

const StudentDetails = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    rollNo: "",
    mobile: "",
    whatsapp: "",
    email: "",
    fatherName: "",
    fatherNumber: "",
    tenthPercent: "",
    tenthYear: "",
    twelfthPercent: "",
    twelfthYear: "",
    school: "",
    passingYear: "",
    degreeAggregate: "",
    mastersDegree: "",
    mastersPercent: "",
    backlogs: "",
    interest: "",
    certifications: "",
    workAnywhere: false,
    experience: "",
    organization: "",
    resume: null,
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="student-form-container">
      <h2 className="form-title">Complete Your Details</h2>
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="form-left">
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

          <label>Roll No</label>
          <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required />

          <label>Mobile No.</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />

          <label>WhatsApp No.</label>
          <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Father's Name</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />

          <label>Father's Mobile No.</label>
          <input type="text" name="fatherNumber" value={formData.fatherNumber} onChange={handleChange} required />

          <label>10th %</label>
          <input type="text" name="tenthPercent" value={formData.tenthPercent} onChange={handleChange} required />

          <label>10th Year of Passing</label>
          <input type="text" name="tenthYear" value={formData.tenthYear} onChange={handleChange} required />

          <label>12th %</label>
          <input type="text" name="twelfthPercent" value={formData.twelfthPercent} onChange={handleChange} required />

          <label>12th Year of Passing</label>
          <input type="text" name="twelfthYear" value={formData.twelfthYear} onChange={handleChange} required />
        </div>

        <div className="form-right">
          <label>School (eg. SOET, SOMC)</label>
          <input type="text" name="school" value={formData.school} onChange={handleChange} required />

          <label>Year of Passing out of KRMU</label>
          <input type="text" name="passingYear" value={formData.passingYear} onChange={handleChange} required />

          <label>Course/Degree Aggregate till date (%)</label>
          <input type="text" name="degreeAggregate" value={formData.degreeAggregate} onChange={handleChange} required />

          <label>Master’s Degree</label>
          <input type="text" name="mastersDegree" value={formData.mastersDegree} onChange={handleChange} />

          <label>Master’s % till date</label>
          <input type="text" name="mastersPercent" value={formData.mastersPercent} onChange={handleChange} />

          <label>Existing No. of Backlogs</label>
          <input type="text" name="backlogs" value={formData.backlogs} onChange={handleChange} required />

          <label>Area of Interest</label>
          <input type="text" name="interest" value={formData.interest} onChange={handleChange} required />

          <label>Certifications (if any)</label>
          <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} />

          <label>Whether ready to work across India?</label>
          <input type="text" name="workAnywhere" value={formData.workAnywhere} onChange={handleChange} />

          <label>Any Experience?</label>
          <input type="text" name="experience" value={formData.experience} onChange={handleChange} />

          <label>If yes, Organization Name</label>
          <input type="text" name="organization" value={formData.organization} onChange={handleChange} />
        </div>

        <div className="form-upload">
          <div className="profile-upload">
            <label>Upload Profile</label>
            <input type="file" name="profilePhoto" onChange={handleChange} />
          </div>

          <div className="resume-upload">
            <label>Upload Resume</label>
            <input type="file" name="resume" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default StudentDetails;
