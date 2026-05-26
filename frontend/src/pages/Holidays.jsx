import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Holidays() {
  const navigate = useNavigate();
  const [holidays] = useState([
    { date: "2024-05-01", name: "Labor Day", type: "National" },
    { date: "2024-05-25", name: "Memorial Day", type: "National" },
    { date: "2024-06-19", name: "Juneteenth", type: "National" },
    { date: "2024-07-04", name: "Independence Day", type: "National" },
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "30px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: "0", color: "#1e293b" }}>Company Holidays</h1>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Back to Dashboard
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Date</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Holiday Name</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 15px" }}>{holiday.date}</td>
                  <td style={{ padding: "12px 15px", fontWeight: "600" }}>{holiday.name}</td>
                  <td style={{ padding: "12px 15px", color: "#059669" }}>{holiday.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Holidays;