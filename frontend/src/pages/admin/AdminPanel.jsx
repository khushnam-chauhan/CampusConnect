import React, { useState } from 'react';
import './AdminPanel.css';
import AdminUserManagement from './AdminUserMgmt';
import AdminApplicationManagement from './AdminApplicationMgmt';
import AdminBulkEmail from './AdminEmailBulk';
import AdminJobs from './AdminJobs';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const mockApi = {
  fetchUsers: async () => ({ data: [] }),
  updateUser: async (userData) => ({ success: true }),
  deleteUser: async (userId) => ({ success: true }),
  
  // Job management API functions
  fetchJobs: async () => ({ data: [] }),
  updateJob: async (jobData) => ({ success: true }),
  deleteJob: async (jobId) => ({ success: true }),
  
  // Application management API functions
  fetchApplications: async () => ({ data: [] }),
  updateApplicationStatus: async (appId, status) => ({ success: true }),
  
  // Email API functions
  fetchUserGroups: async () => ({ 
    data: {
      roles: ['student', 'faculty', 'staff', 'admin'],
      departments: ['Computer Science', 'Engineering', 'Business', 'Arts'],
      years: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
    } 
  }),
  fetchEmailTemplates: async () => ({ data: [] }),
  saveTemplate: async (template) => ({ success: true }),
  sendBulkEmail: async (formData) => ({ success: true })
};


const AdminPanel = () => {
  const dispatch = useDispatch(); 

  const handleLogout = () => {
    dispatch(logout()); 
    window.location.href = "/login";
  };
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    totalUsers: 1254,
    activeUsers: 987,
    pendingApprovals: 42
  });
  const [applicationStats, setApplicationStats] = useState({
    totalApplications: 568,
    pendingReview: 87,
    approved: 342,
    rejected: 139
  });
  const [jobStats, setJobStats] = useState({
    totalJobs: 325,
    activeJobs: 176,
    expiredJobs: 149
  });
  const [emailStats, setEmailStats] = useState({
    emailsSent: 15432,
    lastCampaign: '2025-02-28',
    openRate: '64%'
  });

  // Function to fetch dashboard stats
  const fetchDashboardStats = async () => {
    // API calls to get actual statistics
   
  };

  // Render the dashboard with key metrics
  const renderDashboard = () => {
    return (
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        
        <div className="stats-grid">
          <div className="stats-card">
            <h3>User Management</h3>
            <div className="stat-item">
              <span className="stat-label">Total Users:</span>
              <span className="stat-value">{userStats.totalUsers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Users:</span>
              <span className="stat-value">{userStats.activeUsers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending Approvals:</span>
              <span className="stat-value">{userStats.pendingApprovals}</span>
            </div>
            <button 
              className="view-more-button"
              onClick={() => setActiveSection('users')}
            >
              Manage Users
            </button>
          </div>
          
          <div className="stats-card">
            <h3>Application Management</h3>
            <div className="stat-item">
              <span className="stat-label">Total Applications:</span>
              <span className="stat-value">{applicationStats.totalApplications}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending Review:</span>
              <span className="stat-value">{applicationStats.pendingReview}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Approval Rate:</span>
              <span className="stat-value">
                {((applicationStats.approved / (applicationStats.approved + applicationStats.rejected)) * 100).toFixed(1)}%
              </span>
            </div>
            <button 
              className="view-more-button"
              onClick={() => setActiveSection('applications')}
            >
              Manage Applications
            </button>
          </div>
          
          <div className="stats-card">
            <h3>Job Management</h3>
            <div className="stat-item">
              <span className="stat-label">Total Jobs:</span>
              <span className="stat-value">{jobStats.totalJobs}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Jobs:</span>
              <span className="stat-value">{jobStats.activeJobs}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Expired Jobs:</span>
              <span className="stat-value">{jobStats.expiredJobs}</span>
            </div>
            <button 
              className="view-more-button"
              onClick={() => setActiveSection('jobs')}
            >
              Manage Jobs
            </button>
          </div>
          
          <div className="stats-card">
            <h3>Email System</h3>
            <div className="stat-item">
              <span className="stat-label">Emails Sent:</span>
              <span className="stat-value">{emailStats.emailsSent}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Campaign:</span>
              <span className="stat-value">{emailStats.lastCampaign}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Open Rate:</span>
              <span className="stat-value">{emailStats.openRate}</span>
            </div>
            <button 
              className="view-more-button"
              onClick={() => setActiveSection('emails')}
            >
              Send Emails
            </button>
          </div>
        </div>
        
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">Today, 10:45 AM</span>
              <span className="activity-description">42 new user registrations</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">Today, 09:30 AM</span>
              <span className="activity-description">15 new job applications submitted</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">Yesterday, 4:15 PM</span>
              <span className="activity-description">Bulk email campaign sent to 876 students</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">Yesterday, 2:10 PM</span>
              <span className="activity-description">8 new jobs posted</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">Mar 8, 11:20 AM</span>
              <span className="activity-description">System maintenance completed</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the active section based on state
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return <AdminUserManagement 
          fetchUsers={mockApi.fetchUsers}
          updateUser={mockApi.updateUser}
          deleteUser={mockApi.deleteUser}
        />;
      case 'jobs':
        return <AdminJobs 
          fetchJobs={mockApi.fetchJobs}
          updateJob={mockApi.updateJob}
          deleteJob={mockApi.deleteJob}
        />;
      case 'applications':
        return <AdminApplicationManagement 
          fetchApplications={mockApi.fetchApplications}
          updateApplicationStatus={mockApi.updateApplicationStatus}
        />;
      case 'emails':
        return <AdminBulkEmail 
          fetchUserGroups={mockApi.fetchUserGroups}
          fetchEmailTemplates={mockApi.fetchEmailTemplates}
          saveTemplate={mockApi.saveTemplate}
          sendBulkEmail={mockApi.sendBulkEmail}
        />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h1>Admin Panel</h1>
        </div>
        <nav className="admin-nav">
          <ul>
            <li className={activeSection === 'dashboard' ? 'active' : ''}>
              <button onClick={() => setActiveSection('dashboard')}>
                <span className="nav-icon">📊</span>
                Dashboard
              </button>
            </li>
            <li className={activeSection === 'users' ? 'active' : ''}>
              <button onClick={() => setActiveSection('users')}>
                <span className="nav-icon">👥</span>
                User Management
              </button>
            </li>
            <li className={activeSection === 'jobs' ? 'active' : ''}>
              <button onClick={() => setActiveSection('jobs')}>
                <span className="nav-icon">💼</span>
                Job Management
              </button>
            </li>
            <li className={activeSection === 'applications' ? 'active' : ''}>
              <button onClick={() => setActiveSection('applications')}>
                <span className="nav-icon">📝</span>
                Applications
              </button>
            </li>
            <li className={activeSection === 'emails' ? 'active' : ''}>
              <button onClick={() => setActiveSection('emails')}>
                <span className="nav-icon">📧</span>
                Bulk Email
              </button>
            </li>
          </ul>
        </nav>
        <div className="admin-profile">
          <div className="profile-info">
            <div className="profile-avatar">A</div>
            <div className="profile-details">
              <div className="profile-name">Admin User</div>
              <div className="profile-role">Super Admin</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <div className="breadcrumb">
            <span>Admin</span>
            <span className="separator">/</span>
            <span>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span>
          </div>
          
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Search..." />
              <button className="search-button">🔍</button>
            </div>
            
            <button className="notification-button">
              🔔
              <span className="notification-badge">3</span>
            </button>
          </div>
        </div>
        
        <div className="admin-body">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;