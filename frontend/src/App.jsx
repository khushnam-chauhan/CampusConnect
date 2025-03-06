import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthContainer from "./pages/loginPage/AuthContainer";
import Login from "./pages/loginPage/Login";
import Signup from "./pages/loginPage/Register";
import StudentDetails from "./pages/studentform/StudentDetails";
import CampusConnectDashboard from "./pages/dashboard/Dashboard";
import CDCTrainings from "./pages/job-listings/CDCTrainings";
import Applications from "./pages/job-listings/Applications";
import JobListings from "./pages/job-listings/JobListings";
import Notifications from "./pages/job-listings/Notifications";
import DashboardLayout from "./layouts/DashboardLayout";
import CV from "./pages/job-listings/CV";
import ProfilePage from "./pages/profile/Profile";

function App() {
  return (
    <Router> 
      <Routes>
        {/* No Sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/authContainer" element={<AuthContainer />} />
        <Route path="/student-details" element={<StudentDetails />} />
        {/* // no navbar */}
        <Route path="/dashboard" element={<DashboardLayout><CampusConnectDashboard /></DashboardLayout>} />
        <Route path="/trainings" element={<DashboardLayout><CDCTrainings /></DashboardLayout>} />
        <Route path="/my-applications" element={<DashboardLayout><Applications /></DashboardLayout>} />
        <Route path="/job-listings" element={<DashboardLayout><JobListings /></DashboardLayout>} />
        <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
        <Route path="/cv" element={<DashboardLayout><CV /></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><ProfilePage /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
