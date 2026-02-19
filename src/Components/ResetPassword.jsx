import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Update error:", error.message);
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Password updated successfully!");

      // redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Reset Password</h2>

        <form onSubmit={handleUpdatePassword}>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Update Password</button>
        </form>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
