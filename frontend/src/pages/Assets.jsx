import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Assets() {
  const navigate = useNavigate();
  const [assets] = useState([
    { id: "A001", item: "Laptop", model: "MacBook Pro", status: "Active", assignedDate: "2023-01-15" },
    { id: "A002", item: "Monitor", model: "Dell 27\" 4K", status: "Active", assignedDate: "2023-01-15" },
    { id: "A003", item: "Keyboard", model: "Mechanical RGB", status: "Active", assignedDate: "2023-02-01" },
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "30px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: "0", color: "#1e293b" }}>My Assets</h1>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Back to Dashboard
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Asset ID</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Item</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Model</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Status</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 15px", fontWeight: "600" }}>{asset.id}</td>
                  <td style={{ padding: "12px 15px" }}>{asset.item}</td>
                  <td style={{ padding: "12px 15px" }}>{asset.model}</td>
                  <td style={{ padding: "12px 15px", color: "#059669", fontWeight: "600" }}>{asset.status}</td>
                  <td style={{ padding: "12px 15px" }}>{asset.assignedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Assets;