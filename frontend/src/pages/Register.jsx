import React, { useState } from "react";
import { request } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register({ toggleView }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    country: "",
    password: "",
  });
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const res = await request("/users/register", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setMsg(res.message || JSON.stringify(res));
  }

  // auto-fetch city & country when pincode is entered
  async function handlePincodeChange(pincode) {
    setForm({ ...form, pincode });

    if (pincode.length === 6) {  // only fetch if 6 digits
      try {
        const resp = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await resp.json();
        if (Array.isArray(data) && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice && data[0].PostOffice[0];
          if (postOffice) {
            setForm({
              ...form,
              pincode,
              city: postOffice.District || postOffice.Block || postOffice.Name,
              country: postOffice.Country || "India",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching city:", err);
      }
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-center h4 fw-bold text-success mb-4">Create Account</h2>
      <form onSubmit={submit} className="needs-validation" noValidate>
        {["name", "email", "phone", "address", "password"].map((f) => (
          <div className="mb-3" key={f}>
            <label htmlFor={`reg-${f}`} className="form-label">
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
            <input
              id={`reg-${f}`}
              type={f === "password" || f === "email" ? f : "text"}
              className="form-control"
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              required
            />
          </div>
        ))}

        {/* Pincode field with auto-fetch */}
        <div className="mb-3">
          <label htmlFor="reg-pincode" className="form-label">Pincode</label>
          <input
            id="reg-pincode"
            type="text"
            className="form-control"
            value={form.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            required
          />
        </div>

        {/* Autofilled city */}
        <div className="mb-3">
          <label htmlFor="reg-city" className="form-label">City</label>
          <input
            id="reg-city"
            type="text"
            className="form-control"
            value={form.city}
            readOnly
          />
        </div>

        {/* Autofilled country */}
        <div className="mb-3">
          <label htmlFor="reg-country" className="form-label">Country</label>
          <input
            id="reg-country"
            type="text"
            className="form-control"
            value={form.country}
            readOnly
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100 fw-bold py-2 mb-3 mt-2"
        >
          Register
        </button>
      </form>

      {msg && <div className="alert alert-success mt-3 text-center">{msg}</div>}

      <p className="text-center mt-3">
        Already have an account?
        <button type="button" className="btn btn-link p-0 ms-1" onClick={() => nav("/login")}>
          Login here
        </button>
      </p>
    </div>
  );
}
