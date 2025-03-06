import React, { useState, useEffect } from 'react';
import './JobListing.css';

const SearchFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: '',
    category: 'All Categories',
    workType: 'All Types',
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Sample data - replace with API calls or props as needed
  const categories = [
    'All Categories',
    'Engineering',
    'Technology',
    'Marketing',
    'Sales',
    'Finance',
    'Human Resources',
    'Education',
    'Healthcare',
    'Design'
  ];

  const workTypes = ['All Types', 'Full-time', 'Part-time', 'Internship'];

  useEffect(() => {
    onFilterChange(filters);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      const updatedSkills = [...filters.skills, skillInput.trim()];
      const updatedFilters = { ...filters, skills: updatedSkills };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = filters.skills.filter(skill => skill !== skillToRemove);
    const updatedFilters = { ...filters, skills: updatedSkills };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      searchTerm: '',
      location: '',
      category: 'All Categories',
      workType: 'All Types',
      skills: []
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    setSkillInput('');
  };

  return (
    <div className={`search-filters-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="search-bar">
        <input
          type="text"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleInputChange}
          placeholder="Search by job title or company..."
          className="search-input"
        />
        <button 
          className="advanced-filters-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="advanced-filters">
        <div className="filter-section">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            placeholder="City, state, or remote"
            className="filter-input"
          />
        </div>

        <div className="filter-section">
          <label>Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="filter-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <label>Job Type</label>
          <select
            name="workType"
            value={filters.workType}
            onChange={handleInputChange}
            className="filter-select"
          >
            {workTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section skills-filter">
          <label>Skills</label>
          <form onSubmit={addSkill} className="skills-input-form">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill..."
              className="filter-input"
            />
            <button type="submit" className="add-skill-btn">Add</button>
          </form>
          <div className="skills-tags">
            {filters.skills.map((skill) => (
              <div key={skill} className="skill-tag">
                {skill}
                <button 
                  onClick={() => removeSkill(skill)}
                  className="remove-skill-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={clearAllFilters} className="clear-filters-btn">
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;