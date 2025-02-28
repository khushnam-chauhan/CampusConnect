import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
    // Add your signup logic here (e.g., API call)
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <div className="social-container">
        <a href="#" className="social"><i className="fab fa-google"></i></a>
        <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="social"><i className="fab fa-github"></i></a>
      </div>
      <span>or use your email for registration</span>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
