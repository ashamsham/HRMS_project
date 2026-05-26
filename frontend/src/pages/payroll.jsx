import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payroll() {
  const navigate = useNavigate();
  const [payslips] = useState([
    { month: "May 2024", salary: "$3000", bonus: "$500", deductions: "$200", netSalary: "$3300" },
    { month: "April 2024", salary: "$3000", bonus: "$0", deductions: "$150", netSalary: "$2850" },
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "30px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: "0", color: "#1e293b" }}>My Payslips</h1>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Back to Dashboard
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Month</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Base Salary</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Bonus</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Deductions</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Net Salary</th>
                <th style={{ padding: "12px 15px", textAlign: "left", color: "#475569" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((slip, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 15px" }}>{slip.month}</td>
                  <td style={{ padding: "12px 15px" }}>{slip.salary}</td>
                  <td style={{ padding: "12px 15px" }}>{slip.bonus}</td>
                  <td style={{ padding: "12px 15px" }}>{slip.deductions}</td>
                  <td style={{ padding: "12px 15px", fontWeight: "600", color: "#2563eb" }}>{slip.netSalary}</td>
                  <td style={{ padding: "12px 15px" }}>
                    <button style={{ padding: "6px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Payroll;