import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // make sure you have supabase.js
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    photo_1: null,
    photo_2: null,
  });


  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Sign up user
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    if (!formData.photo_1 || !formData.photo_2) {
      alert("Please upload at least 2 photos");
      setLoading(false);
      return;
    }


    // 2️⃣ Confirm session exists
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      alert("Session not active. Please login.");
      setLoading(false);
      return;
    }

    // 3️⃣ Insert profile (optional but recommended)
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: authData.user.id,
        first_name: formData.first_name,
        gender: formData.gender,
        location_city: formData.location_city,
      });

    if (profileError) {
      alert(profileError.message);
      setLoading(false);
      return;
    }

    // ✅ 4️⃣ Redirect to Main Page
    navigate("/MainPage");
    setLoading(false);
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit} noValidate>

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

          <div>
            <label>Profile Photo 1 (Required)</label>
            <input
              type="file"
              name="photo_1"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Profile Photo 2 (Required)</label>
            <input
              type="file"
              name="photo_2"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <p style={{ fontSize: "12px", color: "#777" }}>
            Upload at least 2 photos to continue
          </p>


          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
