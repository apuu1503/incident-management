// src/pages/ResetPassword.js
import React, { useState } from "react";
import { request } from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams(); // token comes from URL
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await request("/users/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setMsg(res.message || "Password reset successful.");
      if (res.success) {
        setTimeout(() => nav("/login"), 2000);
      }
    } catch (err) {
      console.error(err);
      setMsg("Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <div className="p-4">
      <h2 className="text-center h4 fw-bold text-primary mb-4">Reset Password</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="new-password" className="form-label">New Password</label>
          <input
            id="new-password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        <button
          type="submit"
          className="btn btn-success w-100 fw-bold py-2"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {msg && <div className="alert alert-info mt-3 text-center">{msg}</div>}
    </div>
  );
}
