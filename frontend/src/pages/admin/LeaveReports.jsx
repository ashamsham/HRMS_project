import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function LeaveReports() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const response = await api.get("/leave/all");
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

  const handleLeaveAction = async (leaveId, status) => {
    try {
      const normalizedStatus = status.toLowerCase();
      await api.put(`/leave/approve/${leaveId}`, { status: normalizedStatus });
      setLeaves((prev) =>
        prev.map((record) =>
          record.id === leaveId ? { ...record, status: normalizedStatus } : record
        )
      );
    } catch (err) {
      setError("Failed to update leave status.");
    }
  };

  return (
    <div>
      <h1>Leave Reports</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading leave data...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.employee_id || "—"}</td>
                  <td>{record.leave_type || "—"}</td>
                  <td>{record.start_date || "—"}</td>
                  <td>{record.end_date || "—"}</td>
                  <td>{calculateDays(record.start_date, record.end_date)}</td>
                  <td>{record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : "—"}</td>
                  <td>{record.reason || "—"}</td>
                  <td>
                    {record.status?.toLowerCase() === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleLeaveAction(record.id, "Approved")}
                          style={{ marginRight: "8px" }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLeaveAction(record.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>{record.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeaveReports;
