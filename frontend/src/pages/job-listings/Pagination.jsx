import React from 'react';
import './JobListing.css';

const Pagination = ({ jobsPerPage, totalJobs, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalJobs / jobsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Logic for displaying page numbers
  const getPageNumbers = () => {
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    
    if (totalPages <= 5) {
      // If there are 5 or fewer pages, show all
      return pageNumbers;
    }
    
    // Always include first, last, current, and adjacent pages
    const result = [];
    
    result.push(1); // First page
    
    if (currentPage > 3) {
      result.push('...'); // Ellipsis after first page if current page is further away
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      result.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      result.push('...'); // Ellipsis before last page if current page is further away
    }
    
    result.push(totalPages); // Last page
    
    return result;
  };

  return (
    <div className="pagination-container">
      <button 
        onClick={() => paginate(currentPage - 1)} 
        disabled={currentPage === 1}
        className="pagination-arrow"
      >
        &laquo; Prev
      </button>
      
      <ul className="pagination-list">
        {getPageNumbers().map((number, index) => (
          number === '...' ? (
            <li key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </li>
          ) : (
            <li key={number} className="pagination-item">
              <button
                onClick={() => paginate(number)}
                className={`pagination-link ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            </li>
          )
        ))}
      </ul>
      
      <button 
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === Math.ceil(totalJobs / jobsPerPage)}
        className="pagination-arrow"
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;