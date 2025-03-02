import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res && res.data) {
        localStorage.setItem("token", res.data.token);

        // Fetch user profile after login
        const profileRes = await axios.get("http://localhost:3000/api/profile/me", {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });

        if (profileRes && profileRes.data) {
          const user = profileRes.data;

          if (user.role === "student") {
            // Check if student details are complete
            if (user.name && user.email && user.phone && user.resume) {
              navigate("/dashboard"); // Redirect to dashboard if details are complete
            } else {
              navigate("/student-details"); // Redirect to form if details are missing
            }
          } else {
            navigate("/dashboard"); // Redirect non-students to dashboard
          }
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response || error.message);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="social-container">
        <a href="#" className="social"><i className="fab fa-google"></i></a>
        <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="social"><i className="fab fa-github"></i></a>
      </div>
      <span>or use your account</span>
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <a href="#">Forgot your password?</a>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Login;
