import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password: "",
    date_of_birth: "",
    gender: "",
    gender_preference: "",
    location_city: "",
    hobbies: "",
    dating_intent: "",
    profile_photo_main: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>

          {/* Gender Preference */}
          <div>
            <label>Interested In</label>
            <select
              name="gender_preference"
              value={formData.gender_preference}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Men</option>
              <option value="female">Women</option>
              <option value="everyone">Everyone</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label>City</label>
            <input
              type="text"
              name="location_city"
              value={formData.location_city}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hobbies */}
          <div>
            <label>Hobbies</label>
            <input
              type="text"
              name="hobbies"
              placeholder="Photography, Music, Travel..."
              value={formData.hobbies}
              onChange={handleChange}
            />
          </div>

          {/* Dating Intent */}
          <div>
            <label>Dating Intent</label>
            <select
              name="dating_intent"
              value={formData.dating_intent}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="friendship">Friendship</option>
              <option value="casual">Casual Dating</option>
              <option value="serious">Serious Relationship</option>
            </select>
          </div>

          {/* Profile Photo */}
          <div>
            <label>Profile Photo</label>
            <input
              type="file"
              name="profile_photo_main"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button type="submit">Create Account</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
