import React, { useState } from "react";
import { request } from "../api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [resetLink, setResetLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setResetLink(null);

    try {
      const res = await request("/users/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMsg(res.message);
      if (res.resetLink) setResetLink(res.resetLink);
    } catch (err) {
      console.error(err);
      setMsg("Something went wrong. Please try again later.");
    }
    setLoading(false);
  }

  return (
    <div className="p-4">
      <h2 className="text-center h4 fw-bold text-primary mb-4">Forgot Password</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="forgot-email" className="form-label">Email</label>
          <input
            id="forgot-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-warning w-100 fw-bold py-2"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {msg && <div className="alert alert-info mt-3 text-center">{msg}</div>}

      {resetLink && (
        <div className="alert alert-success mt-3 text-center">
          <p className="mb-1">Reset Link:</p>
          <a href={resetLink} target="_blank" rel="noreferrer">
            {resetLink}
          </a>
        </div>
      )}

      <p className="text-center mt-3">
        Remember your password?
        <button
          type="button"
          className="btn btn-link p-0 ms-1"
          onClick={() => nav("/login")}
        >
          Back to Login
        </button>
      </p>
    </div>
  );
}
