import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // Add your login logic here (e.g., API call)
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
