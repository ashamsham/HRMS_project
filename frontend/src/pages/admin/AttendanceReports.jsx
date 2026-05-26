import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function Attendance() {
  const [records, setRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState("");

  // OFFICE SETTINGS
  const OFFICE_START_HOUR = 9;
  const OFFICE_START_MINUTE = 30;
  const OFFICE_WORKING_HOURS = 8;

  // TODAY
  const todayISO = new Date()
    .toISOString()
    .split("T")[0];

  // LOAD ATTENDANCE
  useEffect(() => {
    loadAttendance();
  }, [selectedMonth]);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/attendance/my-attendance?month=${selectedMonth}`
      );

      if (response.data) {
        setRecords(response.data);
      }
    } catch (error) {
      console.log(
        "Attendance Load Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // TODAY RECORD
  const todayRecord = useMemo(() => {
    return records.find((r) => {
      const recordDate =
        r.attendance_date
          ?.toString()
          ?.split("T")[0];

      return recordDate === todayISO;
    });
  }, [records, todayISO]);

  // FORMAT TIME
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // FORMAT DATE
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB");
  };

  // CHECK IN
  const handleCheckIn = async () => {
    const now = new Date();

    const currentDate = todayISO;

    const currentTime = formatTime(now);

    // OFFICE START TIME
    const officeStart = new Date();

    officeStart.setHours(
      OFFICE_START_HOUR,
      OFFICE_START_MINUTE,
      0,
      0
    );

    // LATE MARK
    let lateMark = "No";

    if (now > officeStart) {
      const lateMinutes = Math.floor(
        (now - officeStart) /
          (1000 * 60)
      );

      lateMark = `${lateMinutes} Minutes`;
    }

    // RECORD
    const newRecord = {
      attendance_date: currentDate,
      status: "Present",
      check_in: currentTime,
      check_out: "",
      late_mark: lateMark,
      overtime_hours: "0",
    };

    // LIVE UPDATE
    setRecords((prev) => {
      const exists = prev.find(
        (r) =>
          r.attendance_date
            ?.toString()
            ?.split("T")[0] ===
          currentDate
      );

      if (exists) {
        return prev.map((r) =>
          r.attendance_date
            ?.toString()
            ?.split("T")[0] ===
          currentDate
            ? newRecord
            : r
        );
      }

      return [newRecord, ...prev];
    });

    setActionStatus(
      "Checked In Successfully"
    );

    // BACKEND
    try {
      await api.post(
        "/attendance/me/check-in"
      );
    } catch (error) {
      console.log(
        "Check In API Error:",
        error
      );
    }
  };

  // CHECK OUT
  const handleCheckOut = async () => {
    const now = new Date();

    const currentDate = todayISO;

    const currentTime = formatTime(now);

    setRecords((prev) =>
      prev.map((record) => {
        const recordDate =
          record.attendance_date
            ?.toString()
            ?.split("T")[0];

        if (
          recordDate === currentDate
        ) {
          // PARSE CHECK IN
          const checkInString =
            record.check_in;

          let overtime = "0";

          if (checkInString) {
            const checkInDate =
              new Date();

            const [time, modifier] =
              checkInString.split(" ");

            let [hours, minutes] =
              time.split(":");

            hours = parseInt(hours);

            if (
              modifier === "PM" &&
              hours !== 12
            ) {
              hours += 12;
            }

            if (
              modifier === "AM" &&
              hours === 12
            ) {
              hours = 0;
            }

            checkInDate.setHours(
              hours,
              parseInt(minutes),
              0,
              0
            );

            // TOTAL HOURS
            const workedHours =
              (now - checkInDate) /
              (1000 * 60 * 60);

            // OVERTIME
            if (
              workedHours >
              OFFICE_WORKING_HOURS
            ) {
              overtime = (
                workedHours -
                OFFICE_WORKING_HOURS
              ).toFixed(1);
            }
          }

          return {
            ...record,
            check_out: currentTime,
            overtime_hours: overtime,
          };
        }

        return record;
      })
    );

    setActionStatus(
      "Checked Out Successfully"
    );

    // BACKEND
    try {
      await api.post(
        "/attendance/me/check-out"
      );
    } catch (error) {
      console.log(
        "Check Out API Error:",
        error
      );
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        My Attendance
      </h1>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={handleCheckIn}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Check In
        </button>

        <button
          onClick={handleCheckOut}
          style={{
            background: "#059669",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Check Out
        </button>
      </div>

      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        {/* DATE */}
        <Card
          title="Date"
          value={formatDate(new Date())}
        />

        {/* STATUS */}
        <Card
          title="Status"
          value={
            todayRecord?.check_in
              ? "Present"
              : "Absent"
          }
          color={
            todayRecord?.check_in
              ? "green"
              : "red"
          }
        />

        {/* CHECK IN */}
        <Card
          title="Check In Time"
          value={
            todayRecord?.check_in ||
            "—"
          }
        />

        {/* CHECK OUT */}
        <Card
          title="Check Out Time"
          value={
            todayRecord?.check_out ||
            "—"
          }
        />
      </div>

      {/* MONTH */}
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <label
          htmlFor="month"
          style={{
            fontWeight: "bold",
            fontSize: "22px",
            marginRight: "10px",
          }}
        >
          Month
        </label>

        <input
          id="month"
          name="month"
          type="month"
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            borderRadius: "8px",
            border:
              "1px solid #cbd5e1",
            fontSize: "16px",
          }}
        />
      </div>

      {/* STATUS */}
      {actionStatus && (
        <div
          style={{
            color: "green",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {actionStatus}
        </div>
      )}

      {/* TABLE */}
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          border:
            "1px solid #d1d5db",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead
            style={{
              background: "#e2e8f0",
            }}
          >
            <tr>
              <th style={thStyle}>
                Date
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Check-In Time
              </th>

              <th style={thStyle}>
                Check-Out Time
              </th>

              <th style={thStyle}>
                Late Mark
              </th>

              <th style={thStyle}>
                Overtime Hours
              </th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign:
                      "center",
                    padding: "20px",
                    fontSize:
                      "18px",
                  }}
                >
                  No attendance records
                  found for this month.
                </td>
              </tr>
            ) : (
              records.map(
                (record, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>
                      {record.attendance_date
                        ?.toString()
                        ?.split("T")[0]}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "green",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {record.status ||
                        "Present"}
                    </td>

                    <td style={tdStyle}>
                      {record.check_in ||
                        "—"}
                    </td>

                    <td style={tdStyle}>
                      {record.check_out ||
                        "—"}
                    </td>

                    <td style={tdStyle}>
                      {record.late_mark ||
                        "No"}
                    </td>

                    <td style={tdStyle}>
                      {record.overtime_hours ||
                        "0"}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// CARD COMPONENT
function Card({
  title,
  value,
  color = "#111827",
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        border:
          "1px solid #d1d5db",
      }}
    >
      <div
        style={{
          color: "#64748b",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontWeight: "bold",
          fontSize: "24px",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// TABLE STYLES
const thStyle = {
  padding: "16px",
  textAlign: "left",
  fontSize: "18px",
  borderBottom:
    "1px solid #cbd5e1",
};

const tdStyle = {
  padding: "16px",
  borderBottom:
    "1px solid #e2e8f0",
  fontSize: "16px",
};

export default Attendance;