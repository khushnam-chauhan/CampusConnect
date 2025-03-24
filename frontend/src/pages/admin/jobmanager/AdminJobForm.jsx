import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminJobs.css";

const AdminJobForm = ({ formMode, initialData, onSubmit, onCancel }) => {
  // Form data state for job creation/editing
  const [formData, setFormData] = useState({
    companyName: "",
    officeAddress: "",
    website: "",
    yearOfEstablishment: "",
    contactPersonName: "",
    contactNumber: "",
    email: "",
    profiles: "",
    eligibility: "",
    vacancies: 1,
    offerType: [],
    ctcOrStipend: "",
    location: "",
    resultDeclaration: "Same day",
    dateOfJoining: "",
    reference: "Self",
    skills: [],
    category: [],
    jobDescription: "",
    companyLogo: "",
    additionalInfo: "",
    status: "pending"
  });
  
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  
  // Available offer types
  const offerTypes = [
    "Full time Employment", 
    "Internship + PPO", 
    "Apprenticeship", 
    "Summer Internship"
  ];
  
  // Common job categories
  const jobCategories = [
    "Software Development",
    "Data Science",
    "Product Management",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "Human Resources",
    "Customer Support",
    "UI/UX Designer",
    "Network Administrator",
    "Database Administrator",
    "DevOps Engineer",
    "Business Intelligence Analyst",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile App Developer",
    "QA Engineer",
    "Project Manager",
    "Other"
  ].sort();

  // Initialize form with data when editing
  useEffect(() => {
    if (initialData && formMode === "edit") {
      // Format date for the input
      const formattedDate = initialData.dateOfJoining ? 
        new Date(initialData.dateOfJoining).toISOString().split("T")[0] : "";
      
      // Handle offerType which might be a string or array
      const offerTypeArray = Array.isArray(initialData.offerType) ? 
        initialData.offerType : [initialData.offerType];
      
      setFormData({
        ...initialData,
        dateOfJoining: formattedDate,
        skills: initialData.skills || [],
        category: initialData.category || [],
        offerType: offerTypeArray
      });
    }
  }, [initialData, formMode]);

  // Form input handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle checkbox changes for offer type
  const handleOfferTypeChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        offerType: [...formData.offerType, value]
      });
    } else {
      setFormData({
        ...formData,
        offerType: formData.offerType.filter(type => type !== value)
      });
    }

    // Clear error
    if (errors.offerType) {
      setErrors({ ...errors, offerType: "" });
    }
  };

  // Handle skill input change
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  // Add skills - processes comma-separated input
  const handleAddSkills = () => {
    if (skillInput.trim()) {
      // Split by comma and trim whitespace
      const newSkills = skillInput
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      // Filter out duplicates
      const uniqueNewSkills = newSkills.filter(skill => !formData.skills.includes(skill));

      if (uniqueNewSkills.length > 0) {
        setFormData({
          ...formData,
          skills: [...formData.skills, ...uniqueNewSkills]
        });

        if (errors.skills) {
          setErrors({ ...errors, skills: "" });
        }
      }

      setSkillInput("");
    }
  };

  // Handle skill input keydown
  const handleSkillInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkills();
    }
  };

  // Remove a skill
  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Handle category input change
  const handleCategoryInputChange = (e) => {
    setCategoryInput(e.target.value);
  };

  // Add category
  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      const newCategories = categoryInput
        .split(",")
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0);

      const uniqueNewCategories = newCategories.filter(cat => !formData.category.includes(cat));

      if (uniqueNewCategories.length > 0) {
        setFormData({
          ...formData,
          category: [...formData.category, ...uniqueNewCategories]
        });

        if (errors.category) {
          setErrors({ ...errors, category: "" });
        }
      }

      setCategoryInput("");
    }
  };

  // Handle category input keydown
  const handleCategoryInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  // Remove a category
  const removeCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      category: formData.category.filter(cat => cat !== categoryToRemove)
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "companyName",
      "officeAddress",
      "website",
      "yearOfEstablishment",
      "contactPersonName",
      "contactNumber",
      "email",
      "profiles",
      "eligibility",
      "vacancies",
      "ctcOrStipend",
      "location",
      "resultDeclaration",
      "dateOfJoining",
      "reference",
      "jobDescription"
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Validate offerType
    if (formData.offerType.length === 0) {
      newErrors.offerType = "Please select at least one offer type";
    }

    // Validate skills
    if (formData.skills.length === 0) {
      newErrors.skills = "Please add at least one skill";
    }

    // Validate category
    if (formData.category.length === 0) {
      newErrors.category = "Please select at least one category";
    }

    // Validate email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate year of establishment
    if (
      formData.yearOfEstablishment &&
      (isNaN(formData.yearOfEstablishment) ||
        formData.yearOfEstablishment < 1800 ||
        formData.yearOfEstablishment > new Date().getFullYear())
    ) {
      newErrors.yearOfEstablishment = "Please enter a valid year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process any skills in the input field
    if (skillInput.trim()) {
      const newSkills = skillInput
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const uniqueNewSkills = newSkills.filter(skill => !formData.skills.includes(skill));

      if (uniqueNewSkills.length > 0) {
        formData.skills = [...formData.skills, ...uniqueNewSkills];
      }
      setSkillInput("");
    }

    // Process any categories in the input field
    if (categoryInput.trim()) {
      const newCategories = categoryInput
        .split(",")
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0);

      const uniqueNewCategories = newCategories.filter(cat => !formData.category.includes(cat));

      if (uniqueNewCategories.length > 0) {
        formData.category = [...formData.category, ...uniqueNewCategories];
      }
      setCategoryInput("");
    }

    if (!validateForm()) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      const processedData = {
        ...formData,
        vacancies: Number.parseInt(formData.vacancies),
        yearOfEstablishment: Number.parseInt(formData.yearOfEstablishment),
        // Use the first selected offer type for the backend
        offerType: formData.offerType[0]
      };
      
      if (formMode === "create") {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/jobs`, 
          processedData,
          { headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` 
            }
          }
        );
        
        onSubmit(response.data.data, "create");
      } else {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/jobs/${formData._id}`, 
          processedData,
          { headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` 
            }
          }
        );
        
        onSubmit(response.data.data, "edit");
      }
      
      setError(null);
    } catch (err) {
      setError(`Failed to ${formMode === "create" ? "create" : "update"} job: ${err.response?.data?.message || err.message}`);
      console.error(`Error ${formMode === "create" ? "creating" : "updating"} job:`, err);
    }
  };

  return (
    <div className="admin-job-form-container">
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-section">
          <h3>Company Information</h3>
          
          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={errors.companyName ? "error" : ""}
            />
            {errors.companyName && <span className="error-message">{errors.companyName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="officeAddress">Office Address *</label>
            <input
              type="text"
              id="officeAddress"
              name="officeAddress"
              value={formData.officeAddress}
              onChange={handleInputChange}
              className={errors.officeAddress ? "error" : ""}
            />
            {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="website">Website *</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={errors.website ? "error" : ""}
                placeholder="https://example.com"
              />
              {errors.website && <span className="error-message">{errors.website}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="yearOfEstablishment">Year Established *</label>
              <input
                type="number"
                id="yearOfEstablishment"
                name="yearOfEstablishment"
                value={formData.yearOfEstablishment}
                onChange={handleInputChange}
                className={errors.yearOfEstablishment ? "error" : ""}
                min="1800"
                max={new Date().getFullYear()}
              />
              {errors.yearOfEstablishment && <span className="error-message">{errors.yearOfEstablishment}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="companyLogo">Company Logo URL</label>
            <input
              type="text"
              id="companyLogo"
              name="companyLogo"
              value={formData.companyLogo}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="contactPersonName">Contact Person *</label>
            <input
              type="text"
              id="contactPersonName"
              name="contactPersonName"
              value={formData.contactPersonName}
              onChange={handleInputChange}
              className={errors.contactPersonName ? "error" : ""}
            />
            {errors.contactPersonName && <span className="error-message">{errors.contactPersonName}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={errors.contactNumber ? "error" : ""}
              />
              {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
          
          <div className="form-group">
          <label htmlFor="reference">Reference *</label>
            <select
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              className={errors.reference ? "error" : ""}
            >
              <option value="Self">Self</option>
              <option value="Dr. Vibha Thakur">Dr. Vibha Thakur</option>
              <option value="Ms. Shruti Bansal">Ms. Shruti Bansal</option>
              <option value="Ms. Mansi Shrivastava">Ms. Mansi Shrivastava</option>
              <option value="Ms. Charu Gola">Ms. Charu Gola</option>
              <option value="Prof. Ravi Kumar">Prof. Ravi Kumar</option>
              <option value="Other">Other</option>
            </select>
            {errors.reference && <span className="error-message">{errors.reference}</span>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Job Details</h3>
          
          <div className="form-group">
            <label htmlFor="profiles">Job Profile *</label>
            <input
              type="text"
              id="profiles"
              name="profiles"
              value={formData.profiles}
              onChange={handleInputChange}
              className={errors.profiles ? "error" : ""}
              placeholder="e.g. Software Engineer, Data Analyst"
            />
            {errors.profiles && <span className="error-message">{errors.profiles}</span>}
          </div>
          
          <div className="form-group">
            <label>Offer Type *</label>
            <div className="checkbox-group">
              {offerTypes.map((type) => (
                <div key={type} className="checkbox-item">
                  <label htmlFor={`offerType-${type}`}>{type}</label>
                  <input
                    type="checkbox"
                    id={`offerType-${type}`}
                    name="offerType"
                    value={type}
                    checked={formData.offerType.includes(type)}
                    onChange={handleOfferTypeChange}
                  />
                </div>
              ))}
            </div>
            {errors.offerType && <span className="error-message">{errors.offerType}</span>}
          </div>
          
          {/* Category Input */}
          <div className="form-group">
            <label htmlFor="category">Job Categories *</label>
            <div className="category-input-container">
              <div className="category-input-wrapper">
                <input
                  type="text"
                  id="category"
                  value={categoryInput}
                  onChange={handleCategoryInputChange}
                  onKeyDown={handleCategoryInputKeyDown}
                  placeholder="Add categories (comma-separated)"
                  className={errors.category ? "error" : ""}
                />
            
              </div>
              
              <div className="category-tags">
                {formData.category.map((category, index) => (
                  <div key={index} className="category-tag">
                    {category}
                    <button 
                      type="button" 
                      className="remove-tag"
                      onClick={() => removeCategory(category)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>
          
          {/* Skills Input */}
          <div className="form-group">
            <label htmlFor="skills">Required Skills *</label>
            <div className="skills-input-container">
              <div className="skills-input-wrapper">
                <input
                  type="text"
                  id="skills"
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  onKeyDown={handleSkillInputKeyDown}
                  placeholder="Add skills (comma-separated)"
                  className={errors.skills ? "error" : ""}
                />
                
              </div>
              
              <div className="skills-list">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill}
                    <button 
                      type="button" 
                      className="remove-tag"
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {errors.skills && <span className="error-message">{errors.skills}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? "error" : ""}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vacancies">Number of Vacancies *</label>
              <input
                type="number"
                id="vacancies"
                name="vacancies"
                value={formData.vacancies}
                onChange={handleInputChange}
                className={errors.vacancies ? "error" : ""}
                min="1"
              />
              {errors.vacancies && <span className="error-message">{errors.vacancies}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="ctcOrStipend">CTC/Stipend *</label>
              <input
                type="text"
                id="ctcOrStipend"
                name="ctcOrStipend"
                value={formData.ctcOrStipend}
                onChange={handleInputChange}
                className={errors.ctcOrStipend ? "error" : ""}
                placeholder="e.g. 8-10 LPA or 15,000/month"
              />
              {errors.ctcOrStipend && <span className="error-message">{errors.ctcOrStipend}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="resultDeclaration">Result Declaration *</label>
              <select
                id="resultDeclaration"
                name="resultDeclaration"
                value={formData.resultDeclaration}
                onChange={handleInputChange}
                className={errors.resultDeclaration ? "error" : ""}
              >
                <option value="Same day">Same day</option>
                <option value="Within a week">Within a week</option>
                <option value="Within two weeks">Within two weeks</option>
                <option value="Within a month">Within a month</option>
              </select>
              {errors.resultDeclaration && <span className="error-message">{errors.resultDeclaration}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfJoining">Date of Joining *</label>
              <input
                type="date"
                id="dateOfJoining"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleInputChange}
                className={errors.dateOfJoining ? "error" : ""}
              />
              {errors.dateOfJoining && <span className="error-message">{errors.dateOfJoining}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="eligibility">Eligibility Criteria *</label>
            <textarea
              id="eligibility"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleInputChange}
              className={errors.eligibility ? "error" : ""}
              rows="3"
            ></textarea>
            {errors.eligibility && <span className="error-message">{errors.eligibility}</span>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Job Description</h3>
          <div className="form-group">
            <label htmlFor="jobDescription">Job Description *</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              className={errors.jobDescription ? "error" : ""}
              rows="6"
            ></textarea>
            {errors.jobDescription && <span className="error-message">{errors.jobDescription}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows="4"
              placeholder="Any additional information that might be relevant"
            ></textarea>
          </div>
          
          {formMode === "edit" && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={errors.status ? "error" : ""}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {errors.status && <span className="error-message">{errors.status}</span>}
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {formMode === "create" ? "Create Job" : "Update Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminJobForm;