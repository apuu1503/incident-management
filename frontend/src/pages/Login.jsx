import React, { useState } from "react";
import { request } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ toggleView }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null);
const nav = useNavigate();


   async function submit(e) {
    e.preventDefault();
    const res = await request("/users/login", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.token) {
      localStorage.setItem("token", res.token);
      nav("/incidents");
    } else {
      setMsg(res.message || "Login failed. Please check your credentials.");
    }
  }
  

  return (
    <div className="p-4">
      <h2 className="text-center h4 fw-bold text-primary mb-4">Welcome Back!</h2>
      <form onSubmit={submit} className="needs-validation" noValidate>
       
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">Email</label>
          <input
            id="login-email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

    
        <div className="mb-4">
          <label htmlFor="login-password" className="form-label">Password</label>
          <input
            id="login-password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold py-2 mb-3"
        >
          Login
        </button>
      </form>
      {msg && <div className="alert alert-info mt-3 text-center">{msg}</div>}
      
      <p className="text-center mt-3">
        Don't have an account? 
        <button type="button" className="btn btn-link p-0 ms-1" onClick={() => nav('/register')}>
          Register here
        </button>
      </p>
      <p className="text-center">
  <button
    type="button"
    className="btn btn-link p-0"
    onClick={() => nav("/forgot-password")}
  >
    Forgot Password?
  </button>
</p>

    </div>
  );
}