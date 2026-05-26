import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="card">
        <h1>404</h1>
        <p>Page Not Found</p>
        <p style={{ fontSize: "14px", marginTop: "20px", color: "#999" }}>
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "30px",
            padding: "10px 24px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default NotFound;
