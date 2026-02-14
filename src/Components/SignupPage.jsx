import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // make sure you have supabase.js
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

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
    if (!emailVerified) {
      alert("Please verify your email first");
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

    const user = sessionData.session.user;

    // 2.5️⃣ Upload photos to Supabase Storage (bucket: 'profiles')
    try {
      const uploadFile = async (file, nameSuffix) => {
        if (!file) {
          throw new Error(`${nameSuffix} file is missing`);
        }
        if (!file.name) {
          throw new Error(`${nameSuffix} file object is invalid (no name property). Got: ${typeof file}`);
        }

        console.log(`Uploading ${nameSuffix}:`, file.name, file.size, file.type);

        const ext = file.name.split('.').pop();
        const filePath = `${user.id}/${nameSuffix}_${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        console.log(`${nameSuffix} uploaded successfully:`, urlData.publicUrl);
        return urlData.publicUrl;
      };

      const photo1Url = await uploadFile(formData.photo_1, 'photo_1');
      const photo2Url = await uploadFile(formData.photo_2, 'photo_2');

      // attach urls to formData for DB insert
      formData.photo_1 = photo1Url;
      formData.photo_2 = photo2Url;
    } catch (err) {
      alert('Photo upload failed: ' + err.message);
      console.error('Upload error:', err);
      setLoading(false);
      return;
    }


    // 3️⃣ Insert profile (including uploaded photo URLs)
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        first_name: formData.first_name,
        gender: formData.gender,
        location_city: formData.location_city,
        date_of_birth: formData.date_of_birth,
        gender_preference: formData.gender_preference,
        hobbies: formData.hobbies,
        dating_intent: formData.dating_intent,
        photo_1: formData.photo_1,
        photo_2: formData.photo_2,
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
  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email: formData.email,
      token: otp,
      type: "email",
    });

    if (error) {
      alert("Invalid OTP");
    } else {
      setEmailVerified(true);
      setShowOtpInput(false);
      alert("Email verified successfully");
    }
  };

  const sendOtp = async () => {
    if (!formData.email) {
      alert("Enter email first");
      return;
    }

    setEmailLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
    });

    setEmailLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setShowOtpInput(true);
      alert("OTP sent to your email");
    }
  };



  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit} noValidate>

          <div>
            <label>Full name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ position: "relative" }}>
            <div className="email-field">
              <label>Email address</label>
              <div className="email-input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={emailVerified}
                  required
                />

                {!emailVerified && (
                  <button
                    type="button"
                    className="send-btn"
                    onClick={sendOtp}
                    disabled={emailLoading}
                  >
                    {emailLoading ? "SENDING..." : "SEND"}
                  </button>
                )}
              </div>

              {emailVerified && (
                <span className="verified-text">✔ Email verified</span>
              )}
            </div>

          </div>
          {showOtpInput && (
            <div className="otp-field">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" onClick={verifyOtp}>
                Verify OTP
              </button>
            </div>
          )}


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
