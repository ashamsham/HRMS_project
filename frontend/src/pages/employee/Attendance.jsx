import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function Attendance() {
  const [records, setRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState("");

  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  // LIVE CLOCK
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // FIND TODAY RECORD
  const todayRecord = useMemo(() => {
    return records.find(
      (r) => r.attendance_date === today
    );
  }, [records, today]);

  // LOAD ATTENDANCE
  useEffect(() => {
    loadAttendance();
  }, [selectedMonth]);

  const loadAttendance = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/attendance/my-attendance?month=${selectedMonth}`
      );

      setRecords(response.data || []);
    } catch (err) {
      setError("Unable to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  // STATUS DISPLAY
  const getStatusDisplay = (record) => {
    if (record.status) return record.status;

    if (record.check_in && record.check_out) {
      return "Present";
    }

    if (record.check_in) {
      return "Checked In";
    }

    return "Absent";
  };

  // STATUS COLORS
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "green";

      case "Checked In":
        return "orange";

      case "Absent":
        return "red";

      default:
        return "black";
    }
  };

  // TODAY STATUS
  const todayStatus = useMemo(() => {
    if (todayRecord?.check_in && todayRecord?.check_out) {
      return "Present";
    }

    if (todayRecord?.check_in) {
      return "Checked In";
    }

    return "Absent";
  }, [todayRecord]);

  // CHECK IN
  const handleCheckIn = async () => {
    setActionStatus("Checking in...");

    const now = new Date();

    const todayDate = now.toISOString().split("T")[0];

    const currentTime = now.toLocaleTimeString("en-GB", {
      hour12: false,
    });

    const newRecord = {
      attendance_date: todayDate,
      check_in: currentTime,
      check_out: null,
      status: "Checked In",
      late_mark: "no",
      overtime_hours: 0,
    };

    // LIVE UI UPDATE
    setRecords((prev) => {
      const exists = prev.find(
        (r) => r.attendance_date === todayDate
      );

      if (exists) {
        return prev.map((r) =>
          r.attendance_date === todayDate
            ? { ...r, ...newRecord }
            : r
        );
      }

      return [newRecord, ...prev];
    });

    try {
      await api.post("/attendance/me/check-in");

      setActionStatus("Checked in successfully.");

      // REFRESH DATA
      await loadAttendance();
    } catch (err) {
      setActionStatus("Failed to check in.");

      // RELOAD OLD DATA
      await loadAttendance();
    }
  };

  // CHECK OUT
  const handleCheckOut = async () => {
    setActionStatus("Checking out...");

    const now = new Date();

    const todayDate = now.toISOString().split("T")[0];

    const currentTime = now.toLocaleTimeString("en-GB", {
      hour12: false,
    });

    // LIVE UI UPDATE
    setRecords((prev) =>
      prev.map((record) => {
        if (
          record.attendance_date === todayDate &&
          record.check_in
        ) {
          return {
            ...record,
            check_out: currentTime,
            status: "Present",
          };
        }

        return record;
      })
    );

    try {
      await api.post("/attendance/me/check-out");

      setActionStatus("Checked out successfully.");

      // REFRESH DATA
      await loadAttendance();
    } catch (err) {
      setActionStatus("Failed to check out.");

      await loadAttendance();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Attendance</h1>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={handleCheckIn}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Check In
        </button>

        <button
          onClick={handleCheckOut}
          style={{
            padding: "10px 20px",
            background: "#059669",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Check Out
        </button>
      </div>

      {/* TODAY STATUS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {/* DATE */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            Date
          </div>

          <div style={{ fontWeight: "bold" }}>
            {today}
          </div>
        </div>

        {/* STATUS */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            Status
          </div>

          <div
            style={{
              fontWeight: "bold",
              color: getStatusColor(todayStatus),
            }}
          >
            {todayStatus}
          </div>
        </div>

        {/* CHECK IN */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            Check In Time
          </div>

          <div style={{ fontWeight: "bold" }}>
            {todayRecord?.check_in || "—"}
          </div>
        </div>

        {/* CHECK OUT */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            Check Out Time
          </div>

          <div style={{ fontWeight: "bold" }}>
            {todayRecord?.check_out || "—"}
          </div>
        </div>
      </div>

      {/* MONTH FILTER */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <label
          htmlFor="monthPicker"
          style={{
            marginRight: "10px",
            fontWeight: "bold",
          }}
        >
          Month
        </label>

        <input
          id="monthPicker"
          name="monthPicker"
          type="month"
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(e.target.value)
          }
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
          }}
        />
      </div>

      {/* STATUS MESSAGES */}
      {actionStatus && (
        <p
          style={{
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {actionStatus}
        </p>
      )}

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: "10px",
          }}
        >
          {error}
        </p>
      )}

      {/* TABLE */}
      {loading ? (
        <p>Loading attendance history...</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f1f5f9",
                }}
              >
                <th style={tableHeader}>Date</th>
                <th style={tableHeader}>Status</th>
                <th style={tableHeader}>
                  Check-In Time
                </th>
                <th style={tableHeader}>
                  Check-Out Time
                </th>
                <th style={tableHeader}>
                  Late Mark
                </th>
                <th style={tableHeader}>
                  Overtime Hours
                </th>
              </tr>
            </thead>

            <tbody>
              {records.length > 0 ? (
                records.map((record) => (
                  <tr
                    key={record.attendance_date}
                  >
                    <td style={tableCell}>
                      {record.attendance_date ||
                        "—"}
                    </td>

                    <td
                      style={{
                        ...tableCell,
                        color: getStatusColor(
                          getStatusDisplay(record)
                        ),
                        fontWeight: "bold",
                      }}
                    >
                      {getStatusDisplay(record)}
                    </td>

                    <td style={tableCell}>
                      {record.check_in || "—"}
                    </td>

                    <td style={tableCell}>
                      {record.check_out || "—"}
                    </td>

                    <td style={tableCell}>
                      {record.late_mark === "yes"
                        ? "Yes"
                        : "No"}
                    </td>

                    <td style={tableCell}>
                      {record.overtime_hours ||
                        "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No attendance records found
                    for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// TABLE HEADER STYLE
const tableHeader = {
  border: "1px solid #e5e7eb",
  padding: "12px",
  textAlign: "left",
};

// TABLE CELL STYLE
const tableCell = {
  border: "1px solid #e5e7eb",
  padding: "12px",
};

export default Attendance;