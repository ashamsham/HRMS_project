import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authapi";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await loginUser({ email, password });

    if (response?.access_token) {
      const token = response.access_token;
      localStorage.setItem("token", token);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role || "";
        localStorage.setItem("role", role);

        if (role.toLowerCase() === "admin") {
          navigate("/admin");
        } else if (role.toLowerCase() === "hr") {
          navigate("/hr");
        } else if (role.toLowerCase() === "manager") {
          navigate("/manager");
        } else {
          navigate("/dashboard");
        }
      } catch (decodeError) {
        navigate("/dashboard");
      }
    } else {
      setError(response?.error || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>HRMS Login</h1>
        <p>Sign in to access the dashboard.</p>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
              required
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
              required
            />
          </div>
          {error && <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;