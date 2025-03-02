"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Book, Menu } from "lucide-react"
import Sidebar from './Sidebar'
import "./dashboard.css"

export default function CampusConnectDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isMenuOpen} 
        onItemClick={() => setIsMenuOpen(false)}
      />
      
      {/* Header */}
      <header className="dashboard-header">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="menu-button"
        >
          <Menu size={20} />
        </button>
        <h1 className="portal-title">CampusConnect - Student Portal</h1>
      </header>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h2 className="welcome-heading">Welcome back, Krishna</h2>
          <p className="welcome-subtext">Here's what's happening with your academic journey</p>
        </div>
        <Link to="/internships" className="apply-button">
          Apply for Internship
        </Link>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <Link to="/jobs" className="dashboard-card jobs-card">
          <h3 className="card-title">Recommended Jobs</h3>
          <div className="card-content">
            <span className="card-number">18</span>
            <span className="card-subtitle">6 new since last week</span>
          </div>
        </Link>

        <Link to="/applications" className="dashboard-card applications-card">
          <h3 className="card-title">Application Status</h3>
          <div className="card-content">
            <span className="card-number">3</span>
            <span className="card-subtitle">2 under review, 1 accepted</span>
          </div>
        </Link>

        <Link to="/notifications" className="dashboard-card notifications-card">
          <h3 className="card-title">New Notifications</h3>
          <div className="card-content">
            <span className="card-number">5</span>
            <span className="card-subtitle">2 job alerts, 3 updates</span>
          </div>
        </Link>

        <Link to="/cv" className="dashboard-card cv-card">
          <h3 className="card-title">CV Insights</h3>
          <div className="card-content">
            <span className="card-number">85%</span>
            <span className="card-subtitle">Completeness score</span>
          </div>
        </Link>
      </div>

      {/* Upcoming Trainings */}
      <div className="trainings-container">
        <h3 className="trainings-title">Upcoming CDC Trainings</h3>

        <Link to="/trainings/resume-writing" className="training-item">
          <div className="book-icon">
            <Book size={32} />
          </div>
          <div className="training-details">
            <h4 className="training-name">Resume Writing Workshop</h4>
            <p className="training-date">May 15, 2025 - 2:00 PM</p>
          </div>
        </Link>

        <Link to="/trainings/interview-skills" className="training-item">
          <div className="book-icon">
            <Book size={32} />
          </div>
          <div className="training-details">
            <h4 className="training-name">Interview Skills Seminar</h4>
            <p className="training-date">May 20, 2025 - 3:30 PM</p>
          </div>
        </Link>

        <Link to="/trainings/tech-trends" className="training-item">
          <div className="book-icon">
            <Book size={32} />
          </div>
          <div className="training-details">
            <h4 className="training-name">Industry Talk: Tech Trends 2023</h4>
            <p className="training-date">May 25, 2025 - 1:00 PM</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

