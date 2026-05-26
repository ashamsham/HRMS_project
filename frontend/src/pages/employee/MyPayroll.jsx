import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function MyPayroll() {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayslips = async () => {
      setLoading(true);
      try {
        const response = await api.get("/payroll/my-payroll");
        setSlips(response.data || []);
      } catch (err) {
        setError("Unable to load payslips.");
      } finally {
        setLoading(false);
      }
    };

    loadPayslips();
  }, []);

  const downloadPayslip = async (payrollId) => {
    try {
      const response = await api.get(`/payroll/payslip/${payrollId}`, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `payslip_${payrollId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Unable to download payslip.");
    }
  };

  return (
    <div>
      <h1>My Payslips</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading payslips...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Payroll Month</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Generated Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slips.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No payslips available.
                  </td>
                </tr>
              ) : (
                slips.map((slip) => (
                  <tr key={slip.id}>
                    <td>{slip.payroll_month || "—"}</td>
                    <td>${slip.net_salary?.toFixed(2) ?? "—"}</td>
                    <td>{slip.status || "Pending"}</td>
                    <td>{slip.generated_date || "—"}</td>
                    <td>
                      {slip.status === "Paid" ? (
                        <button onClick={() => downloadPayslip(slip.id)}>
                          Download
                        </button>
                      ) : (
                        <span>Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyPayroll;