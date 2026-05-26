import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Appraisals() {
  const navigate = useNavigate();
  const [appraisals] = useState([
    { period: "2024 Q1", rating: "4.5/5", reviewer: "Manager", feedback: "Great performance and collaboration" },
    { period: "2023 Q4", rating: "4.0/5", reviewer: "Manager", feedback: "Good progress on projects" },
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "30px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: "0", color: "#1e293b" }}>My Appraisals</h1>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Back to Dashboard
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Period</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Rating</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Reviewer</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {appraisals.map((appraisal, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 15px" }}>{appraisal.period}</td>
                  <td style={{ padding: "12px 15px", fontWeight: "600", color: "#ca8a04" }}>{appraisal.rating}</td>
                  <td style={{ padding: "12px 15px" }}>{appraisal.reviewer}</td>
                  <td style={{ padding: "12px 15px" }}>{appraisal.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Appraisals;