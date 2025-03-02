import { useEffect, useState } from "react";
import axios from "axios";
import "./studentDetails.css";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";

const StudentDetails = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNo: "",
    mobileNo: "",
    whatsappNo: "",
    mailId: "",
    fatherName: "",
    fatherNumber: "",
    education: {
      tenth: { percentage: "", passingYear: "" },
      twelfth: { percentage: "", passingYear: "" },
      graduation: { degree: "", percentageOrCGPA: "", passingYear: "" },
      masters: { degree: "", percentageOrCGPA: "", passingYear: "" },
    },
    school: "",
    existingBacklogs: "",
    areaOfInterest: "",
    hasCertifications: false,
    certifications: [],
    readyToRelocate: false,
    experience: {
      hasExperience: false,
      organizationName: "",
      duration: "",
      details: "",
    },
    resume: null,
    profilePhoto: null,
  });

  const [loading, setLoading] = useState(false);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched User Data:", res.data); // Debugging

        setFormData((prev) => ({
          ...prev,
          ...res.data,
          profilePhoto: res.data.profilePhoto
            ? `${API_URL}/${res.data.profilePhoto}`
            : null, // Ensure full URL
          education: res.data.education || prev.education,
          experience: res.data.experience || prev.experience,
          hasCertifications:
            res.data.certifications && res.data.certifications.length > 0,
          certifications: res.data.certifications || [],
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (name.startsWith("certificationImage")) {
        const index = parseInt(name.split("-")[1]);
        const updatedCertifications = [...formData.certifications];
        updatedCertifications[index] = {
          ...updatedCertifications[index],
          image: files[0],
        };
        setFormData((prev) => ({
          ...prev,
          certifications: updatedCertifications,
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else if (type === "checkbox") {
      if (name === "hasCertifications") {
        setFormData((prev) => ({
          ...prev,
          hasCertifications: checked,
          certifications: checked ? [...prev.certifications] : [],
        }));
      } else if (name === "experience.hasExperience") {
        setFormData((prev) => ({
          ...prev,
          experience: { ...prev.experience, hasExperience: checked },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (name.startsWith("education")) {
      const keys = name.split(".");
      setFormData((prev) => ({
        ...prev,
        education: {
          ...prev.education,
          [keys[1]]: { ...prev.education[keys[1]], [keys[2]]: value },
        },
      }));
    } else if (name.startsWith("experience")) {
      const keys = name.split(".");
      setFormData((prev) => ({
        ...prev,
        experience: { ...prev.experience, [keys[1]]: value },
      }));
    } else if (name.startsWith("certification")) {
      const [field, index] = name.split("-");
      const updatedCertifications = [...formData.certifications];
      updatedCertifications[parseInt(index)] = {
        ...updatedCertifications[parseInt(index)],
        name: value,
      };
      setFormData((prev) => ({
        ...prev,
        certifications: updatedCertifications,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", image: null }],
    }));
  };

  const removeCertification = (index) => {
    const updatedCertifications = formData.certifications.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "education" || key === "experience") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === "certifications") {
        formDataToSend.append(
          key,
          JSON.stringify(
            formData.certifications.map((cert) => ({
              name: cert.name,
              image: typeof cert.image === "string" ? cert.image : null,
            }))
          )
        );

        // Append certification images separately
        formData.certifications.forEach((cert, index) => {
          if (cert.image && typeof cert.image !== "string") {
            formDataToSend.append(`certificationImage-${index}`, cert.image);
          }
        });
      } else if (key === "profilePhoto" || key === "resume") {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      } else if (key !== "hasCertifications") {
        // Skip the hasCertifications flag
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/users/update-profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
      <Navbar/>
      <div className="student-form-container">
      {loading && <LoadingScreen />}
      <h2 className="form-title">Complete Your Details</h2>
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-column">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Roll No.</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Mobile No.</label>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>WhatsApp No.</label>
              <input
                type="text"
                name="whatsappNo"
                value={formData.whatsappNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Father's Mobile No.</label>
              <input
                type="text"
                name="fatherNumber"
                value={formData.fatherNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>10th %</label>
              <input
                type="text"
                name="education.tenth.percentage"
                value={formData.education.tenth.percentage}
                onChange={handleChange}
                required
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
              />
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>12th %</label>
              <input
                type="text"
                name="education.twelfth.percentage"
                value={formData.education.twelfth.percentage}
                onChange={handleChange}
                required
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
              />
            </div>

            <div className="form-group">
              <label>School (eg. SOET, SOMC)</label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
              >
                <option value="">Select School</option>
                <option value="SOET">SOET</option>
                <option value="SOMC">SOMC</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Existing No. of Backlogs</label>
              <input
                type="text"
                name="existingBacklogs"
                value={formData.existingBacklogs}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Area of Interest</label>
            <input
              type="text"
              name="areaOfInterest"
              value={formData.areaOfInterest}
              onChange={handleChange}
              required
            />
          </div>

          {/* Certifications section */}
          <div className="form-group">
            <label>Do you have any certifications?</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="hasCertifications"
                checked={formData.hasCertifications}
                onChange={(e) => handleChange(e)}
                id="hasCertifications"
              />
              <label htmlFor="hasCertifications">Yes</label>
            </div>
          </div>

          {formData.hasCertifications && (
            <div className="certifications-container">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <div className="form-group">
                    <label>Certification Name</label>
                    <input
                      type="text"
                      placeholder="Course name"
                      name={`certification-${index}`}
                      value={cert.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Certificate Image</label>
                    <div className="file-input-container">
                      <button
                        type="button"
                        className="file-select-btn"
                        onClick={() =>
                          document.getElementById(`certImage-${index}`).click()
                        }
                      >
                        {cert.image ? "Change Image" : "Select Image"}
                      </button>
                      <span className="file-name">
                        {cert.image
                          ? typeof cert.image === "string"
                            ? "Image uploaded"
                            : cert.image.name
                          : "No file selected"}
                      </span>
                    </div>
                    <input
                      id={`certImage-${index}`}
                      type="file"
                      name={`certificationImage-${index}`}
                      onChange={handleChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeCertification(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-button"
                onClick={addCertification}
              >
                Add Another Certification
              </button>
            </div>
          )}

          <div className="form-group">
            <label>Whether ready to work across India?</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="readyToRelocate"
                checked={formData.readyToRelocate}
                onChange={handleChange}
                id="readyToRelocate"
              />
              <label htmlFor="readyToRelocate">Yes</label>
            </div>
          </div>

          {/* Experience section */}
          <div className="form-group">
            <label>Do you have any experience?</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="experience.hasExperience"
                checked={formData.experience.hasExperience}
                onChange={handleChange}
                id="hasExperience"
              />
              <label htmlFor="hasExperience">Yes</label>
            </div>
          </div>

          {formData.experience.hasExperience && (
            <div className="experience-container">
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  name="experience.organizationName"
                  value={formData.experience.organizationName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="experience.duration"
                  value={formData.experience.duration}
                  onChange={handleChange}
                  placeholder="e.g., 6 months, 2 years"
                  required
                />
              </div>
              <div className="form-group">
                <label>Details</label>
                <textarea
                  name="experience.details"
                  value={formData.experience.details}
                  onChange={handleChange}
                  placeholder="Describe your role and responsibilities"
                  rows="4"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div className="profile-upload-section">
          <div className="profile-photo-container">
            <div className="profile-photo-preview">
              {formData.profilePhoto ? (
                <img
                  src={
                    formData.profilePhoto
                      ? typeof formData.profilePhoto === "string"
                        ? formData.profilePhoto.startsWith("http") ||
                          formData.profilePhoto.startsWith("/")
                          ? formData.profilePhoto
                          : `${API_URL}/${formData.profilePhoto}`
                        : URL.createObjectURL(formData.profilePhoto) 
                      : "default-avatar.png"
                  }
                  alt="Profile Preview"
                />
              ) : (
                <div className="profile-placeholder">
                  <span>+</span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="upload-btn"
              onClick={() =>
                document.getElementById("profilePhotoInput").click()
              }
            >
              Upload Profile
            </button>
            <input
              id="profilePhotoInput"
              type="file"
              name="profilePhoto"
              onChange={handleChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div className="resume-upload-container">
            <div className="resume-preview">
              {formData.resume ? (
                <div className="resume-uploaded">
                  <span>Resume Uploaded</span>
                </div>
              ) : (
                <div className="resume-placeholder">
                  <span>+</span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="upload-btn"
              onClick={() => document.getElementById("resumeInput").click()}
            >
              Upload Resume
            </button>
            <input
              id="resumeInput"
              type="file"
              name="resume"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
      </>

  );
};

export default StudentDetails;
