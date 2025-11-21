import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/    api";

export default function Login() {
  const [username, setUsername] = useState("rahul");
  const [password, setPassword] = useState("tracker@123");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("auth/login/", { username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed — please check credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h1 className="card-header" style={{ textAlign: 'center' }}>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input id="username" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="button button-primary" style={{ width: '100%', marginTop: '24px' }}>Login</button>
        </form>
        <div style={{ marginTop: '24px', textAlign: 'center', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '6px' }}>
          <strong>Test Credentials</strong>
          <div>Username: <code>rahul</code></div>
          <div>Password: <code>tracker@123</code></div>
        </div>
      </div>
    </div>
  );
}