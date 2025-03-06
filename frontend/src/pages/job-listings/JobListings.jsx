import React, { useState, useEffect } from 'react';
import './JobListing.css';
import SearchFilters from './SearchFilters';
import JobCard from './JobCard';
import Pagination from './Pagination';

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
  
        const jobsArray = data.data || [];
  
        const approvedJobs = jobsArray
          .filter(job => job.status === 'approved')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort latest jobs first
  
        setJobs(approvedJobs);
        setFilteredJobs(approvedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchJobs();
  }, []);
  

  const handleFilterChange = (filters) => {
    let results = [...jobs];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        job => 
          job.position.toLowerCase().includes(searchLower) || 
          job.organizationName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.location) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.category && filters.category !== 'All Categories') {
      results = results.filter(job => job.category === filters.category);
    }

    if (filters.workType && filters.workType !== 'All Types') {
      results = results.filter(job => job.workType === filters.workType);
    }

    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(job => 
        filters.skills.every(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
    setCurrentPage(1);
    setFilteredJobs(results);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="job-listing-page">
      <SearchFilters onFilterChange={handleFilterChange} />
      <div className="job-results-info">
        <p>Found <span className="job-count">{filteredJobs.length}</span> job listings</p>
      </div>
      <div className="job-grid">
        {currentJobs.length > 0 ? (
          currentJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))
        ) : (
          <div className="no-jobs-message">
            <h3>No jobs match your search criteria</h3>
            <p>Try adjusting your filters or search for something else</p>
          </div>
        )}
      </div>
      {filteredJobs.length > jobsPerPage && (
        <Pagination
          jobsPerPage={jobsPerPage}
          totalJobs={filteredJobs.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default JobListingPage;


































// import React, { useState, useEffect } from 'react';
// import './JobListing.css';
// import SearchFilters from './SearchFilters';
// import JobCard from './JobCard';
// import Pagination from './Pagination';

// const JobListingPage = () => {
//   const [jobs, setJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [jobsPerPage] = useState(6); 

//   useEffect(() => {
//     const mockJobs = [
//       {
//         _id: "job001",
//         employerName: "Rajesh Sharma",
//         contactNumber: "+91 98765 43210",
//         organizationName: "TechVision India",
//         whatsappNumber: "+91 98765 43211",
//         email: "careers@techvision.in",
//         position: "Senior MERN Stack Developer",
//         startingDate: "2025-04-10T00:00:00.000Z",
//         applicationDeadline: "2025-03-25T00:00:00.000Z",
//         salaryRange: "₹18,00,000 - ₹25,00,000",
//         openings: 3,
//         location: "Bengaluru, Karnataka (Hybrid)",
//         workType: "Full-time",
//         category: "Information Technology",
//         eligibilityCriteria: "B.Tech/B.E. in Computer Science or related field. Minimum 4 years of experience with MongoDB, Express.js, React, and Node.js. Experience with state management libraries like Redux and testing frameworks like Jest. Knowledge of AWS or Azure cloud services.",
//         jobDescription: "TechVision India is seeking experienced MERN Stack Developers to join our rapidly growing product engineering team. You will be responsible for building scalable web applications for our enterprise clients in the fintech sector. The ideal candidate has a passion for clean code and stays updated with the latest JavaScript ecosystem developments.\n\nResponsibilities include:\n- Developing end-to-end web applications using MongoDB, Express.js, React, and Node.js\n- Building reusable components and frontend libraries\n- Optimizing applications for maximum performance and scalability\n- Implementing responsive design and ensuring cross-browser compatibility\n- Collaborating with UX designers, backend developers, and product managers",
//         skills: ["MongoDB", "Express.js", "React", "Node.js", "JavaScript", "TypeScript", "Redux", "AWS"],
//         socialLinks: ["https://linkedin.com/company/techvision-india", "https://twitter.com/techvision_in"],
//         messageForCDC: "We are looking for candidates who can join immediately. Fresh graduates with exceptional project work will also be considered for junior positions.",
//         attachments: ["https://example.com/job-details.pdf"],
//         status: "approved",
//         postedBy: null,
//         externalApplicationLink: ""
//       },
//       {
//         _id: "job002",
//         employerName: "Priya Mehta",
//         contactNumber: "+91 87654 32109",
//         organizationName: "GreenFuture Foundation",
//         whatsappNumber: "",
//         email: "recruitment@greenfuture.org",
//         position: "Environmental Research Fellow",
//         startingDate: "2025-05-01T00:00:00.000Z",
//         applicationDeadline: "2025-04-10T00:00:00.000Z",
//         salaryRange: "₹35,000 - ₹45,000 per month",
//         openings: 5,
//         location: "Delhi NCR (Field work + Office)",
//         workType: "Fellowship",
//         category: "Environmental Science",
//         eligibilityCriteria: "Master's degree in Environmental Science, Climate Studies, or related field. Research experience in climate change mitigation. Strong analytical skills and proficiency in data analysis tools. Excellent written and verbal communication in English and Hindi. Willingness to conduct fieldwork in rural areas.",
//         jobDescription: "GreenFuture Foundation is offering a one-year fellowship program for passionate environmentalists interested in climate action research. Fellows will work on projects related to sustainable agriculture, renewable energy adoption, and climate change adaptation strategies in rural India. This hands-on opportunity allows contributors to make a real impact on environmental policy and community practices.\n\nFellows will:\n- Conduct field research in selected rural communities across North India\n- Analyze environmental data and prepare comprehensive reports\n- Collaborate with government agencies and local NGOs\n- Develop sustainable solutions tailored to local contexts\n- Participate in policy advocacy and community awareness programs",
//         skills: ["Environmental Assessment", "Data Analysis", "GIS Mapping", "Research Methodology", "Scientific Writing", "Community Engagement"],
//         socialLinks: ["https://linkedin.com/company/greenfuture-foundation"],
//         messageForCDC: "The fellowship includes accommodation during field visits and comprehensive health insurance. Preference will be given to candidates with prior rural fieldwork experience.",
//         attachments: [],
//         status: "approved",
//         postedBy: null,
//         externalApplicationLink: "https://forms.google.com/fellowship-application"
//       },
//       {
//         _id: "job003",
//         employerName: "Dr. Sunita Patel",
//         contactNumber: "+91 76543 21098",
//         organizationName: "Arogya Healthcare",
//         whatsappNumber: "+91 76543 21099",
//         email: "hr@arogyahealthcare.in",
//         position: "Medical Officer - General Medicine",
//         startingDate: "2025-04-01T00:00:00.000Z",
//         applicationDeadline: "2025-03-15T00:00:00.000Z",
//         salaryRange: "₹12,00,000 - ₹15,00,000",
//         openings: 4,
//         location: "Mumbai, Maharashtra (On-site)",
//         workType: "Full-time",
//         category: "Healthcare",
//         eligibilityCriteria: "MBBS from a recognized university. MD/DNB in General Medicine preferred. Registration with Maharashtra Medical Council. Minimum 2 years of clinical experience. Good communication skills in English, Hindi, and Marathi.",
//         jobDescription: "Arogya Healthcare is seeking dedicated Medical Officers to join our expanding network of primary care clinics across Mumbai. As a Medical Officer, you will provide comprehensive healthcare services to patients of all age groups, manage chronic diseases, and coordinate with specialists for advanced care when needed.\n\nResponsibilities include:\n- Conducting patient consultations and physical examinations\n- Diagnosing illnesses and prescribing appropriate treatments\n- Managing chronic disease patients through regular follow-ups\n- Maintaining detailed electronic medical records\n- Participating in health camps and community outreach programs\n- Adhering to clinical protocols and quality standards",
//         skills: ["Patient Examination", "Diagnosis", "Treatment Planning", "Electronic Medical Records", "Preventive Care", "Patient Counseling"],
//         socialLinks: ["https://linkedin.com/company/arogya-healthcare"],
//         messageForCDC: "We offer a structured career progression path and regular CME opportunities. Doctors with experience in managing lifestyle diseases will be preferred.",
//         attachments: ["https://example.com/job-description.pdf", "https://example.com/benefits.pdf"],
//         status: "approved",
//         postedBy: null,
//         externalApplicationLink: ""
//       },
//       {
//         _id: "job004",
//         employerName: "Arjun Malhotra",
//         contactNumber: "+91 65432 10987",
//         organizationName: "Fintech Solutions",
//         whatsappNumber: "",
//         email: "talent@fintechsolutions.co.in",
//         position: "Data Scientist - Credit Risk",
//         startingDate: "2025-05-15T00:00:00.000Z",
//         applicationDeadline: "2025-04-05T00:00:00.000Z",
//         salaryRange: "₹20,00,000 - ₹28,00,000",
//         openings: 2,
//         location: "Hyderabad, Telangana (Hybrid)",
//         workType: "Full-time",
//         category: "Finance",
//         eligibilityCriteria: "Master's or PhD in Statistics, Mathematics, Computer Science, or related field. 3+ years of experience in data science with focus on financial risk modeling. Strong programming skills in Python and R. Experience with credit scoring models. Knowledge of SQL and big data technologies like Hadoop or Spark.",
//         jobDescription: "Fintech Solutions is looking for skilled Data Scientists to join our Credit Risk Analytics team. In this role, you will develop sophisticated machine learning models to assess creditworthiness of individuals and small businesses, particularly in underserved markets. You will work with alternative data sources and traditional financial information to create innovative risk assessment frameworks.\n\nKey responsibilities:\n- Developing and deploying credit risk models for loan approval automation\n- Creating algorithms to detect fraud and prevent defaults\n- Analyzing patterns in repayment behavior to optimize lending strategies\n- Building real-time monitoring systems for portfolio risk assessment\n- Collaborating with product teams to implement model-driven features\n- Researching and applying latest techniques in financial risk modeling",
//         skills: ["Python", "R", "Machine Learning", "Statistical Modeling", "SQL", "Credit Scoring", "Data Visualization", "PySpark"],
//         socialLinks: ["https://linkedin.com/company/fintech-solutions-india"],
//         messageForCDC: "We offer ESOP benefits and performance-based bonuses. Candidates with experience in developing models for the Indian market will be given preference.",
//         attachments: [],
//         status: "approved",
//         postedBy: null,
//         externalApplicationLink: "https://fintechsolutions.co.in/careers"
//       },
//       {
//         _id: "job005",
//         employerName: "Nikita Reddy",
//         contactNumber: "+91 54321 09876",
//         organizationName: "Pixel Perfect Designs",
//         whatsappNumber: "+91 54321 09877",
//         email: "careers@pixelperfect.in",
//         position: "UI/UX Designer",
//         startingDate: "2025-04-20T00:00:00.000Z",
//         applicationDeadline: "2025-03-30T00:00:00.000Z",
//         salaryRange: "₹8,00,000 - ₹12,00,000",
//         openings: 3,
//         location: "Pune, Maharashtra (On-site with WFH flexibility)",
//         workType: "Full-time",
//         category: "Design",
//         eligibilityCriteria: "Bachelor's degree in Design, Human-Computer Interaction, or related field. 2+ years of experience in UI/UX design for digital products. Proficiency in Figma, Adobe XD, and other design tools. Portfolio demonstrating user-centered design approach. Understanding of design systems and component libraries.",
//         jobDescription: "Pixel Perfect Designs is seeking creative UI/UX Designers to join our design studio. We work with startups and established businesses across e-commerce, edtech, and healthcare sectors. The ideal candidate will combine aesthetic sensibility with user-centered design principles to create intuitive and engaging digital experiences.\n\nAs a UI/UX Designer, you will:\n- Create wireframes, prototypes, and high-fidelity mockups for web and mobile applications\n- Conduct user research and usability testing to inform design decisions\n- Develop comprehensive design systems with reusable components\n- Collaborate with developers to ensure accurate implementation of designs\n- Stay updated with latest design trends and accessibility standards\n- Present design concepts to clients and incorporate feedback",
//         skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Interaction Design", "Visual Design", "Design Systems"],
//         socialLinks: ["https://instagram.com/pixelperfect.design", "https://behance.net/pixelperfectdesigns", "https://dribbble.com/pixelperfect"],
//         messageForCDC: "Please ensure applicants submit their portfolio links. We are particularly interested in candidates with experience designing for diverse Indian user bases across different socioeconomic backgrounds.",
//         attachments: [],
//         status: "approved",
//         postedBy: null,
//         externalApplicationLink: ""
//       }
//     ];
    
//     const approvedJobs = mockJobs.filter(job => job.status === "approved");
    
//     setJobs(approvedJobs);
//     setFilteredJobs(approvedJobs);
//     setIsLoading(false);
//   }, []);

//   const handleFilterChange = (filters) => {
//     let results = [...jobs];

//     if (filters.searchTerm) {
//       const searchLower = filters.searchTerm.toLowerCase();
//       results = results.filter(
//         job => 
//           job.position.toLowerCase().includes(searchLower) || 
//           job.organizationName.toLowerCase().includes(searchLower)
//       );
//     }

//     // Filter by location
//     if (filters.location) {
//       results = results.filter(job => 
//         job.location.toLowerCase().includes(filters.location.toLowerCase())
//       );
//     }

//     // Filter by category
//     if (filters.category && filters.category !== 'All Categories') {
//       results = results.filter(job => job.category === filters.category);
//     }

//     // Filter by work type
//     if (filters.workType && filters.workType !== 'All Types') {
//       results = results.filter(job => job.workType === filters.workType);
//     }

//     // Filter by skills
//     if (filters.skills && filters.skills.length > 0) {
//       results = results.filter(job => 
//         filters.skills.every(skill => 
//           job.skills.some(jobSkill => 
//             jobSkill.toLowerCase().includes(skill.toLowerCase())
//           )
//         )
//       );
//     }
//     setCurrentPage(1);
//     setFilteredJobs(results);
//   };

//   const indexOfLastJob = currentPage * jobsPerPage;
//   const indexOfFirstJob = indexOfLastJob - jobsPerPage;
//   const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (isLoading) {
//     return <div className="loading-container"><div className="loading-spinner"></div></div>;
//   }

//   if (error) {
//     return <div className="error-message">Error: {error}</div>;
//   }

//   return (
//     <div className="job-listing-page">
//       <SearchFilters onFilterChange={handleFilterChange} />

//       <div className="job-results-info">
//         <p>Found <span className="job-count">{filteredJobs.length}</span> job listings</p>
//       </div>

//       <div className="job-grid">
//         {currentJobs.length > 0 ? (
//           currentJobs.map(job => (
//             <JobCard key={job._id} job={job} />
//           ))
//         ) : (
//           <div className="no-jobs-message">
//             <h3>No jobs match your search criteria</h3>
//             <p>Try adjusting your filters or search for something else</p>
//           </div>
//         )}
//       </div>

//       {filteredJobs.length > jobsPerPage && (
//         <Pagination
//           jobsPerPage={jobsPerPage}
//           totalJobs={filteredJobs.length}
//           paginate={paginate}
//           currentPage={currentPage}
//         />
//       )}
//     </div>
//   );
// };

// export default JobListingPage;