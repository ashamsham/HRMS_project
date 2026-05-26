import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function LeaveStatus() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const response = await api.get("/leave/my-leaves");
        setLeaves(response.data || []);
      } catch (err) {
        setError("Failed to load leave records.");
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, []);

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return "—";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending': return 'orange';
      default: return 'black';
    }
  };

  return (
    <div>
      <h1>My Leave Status</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading leave data...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.leave_type || "—"}</td>
                  <td>{record.start_date || "—"}</td>
                  <td>{record.end_date || "—"}</td>
                  <td>{calculateDays(record.start_date, record.end_date)}</td>
                  <td style={{ color: getStatusColor(record.status), fontWeight: 'bold' }}>
                    {record.status || "—"}
                  </td>
                  <td>{record.reason || "—"}</td>
                  <td>{record.created_at ? new Date(record.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeaveStatus;