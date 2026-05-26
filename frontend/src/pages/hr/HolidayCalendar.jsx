import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function HolidayCalendar() {
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    holiday_name: "",
    holiday_date: "",
    description: ""
  });

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      const response = await api.get("/holiday/all");
      setHolidays(response.data || []);
    } catch (err) {
      setError("Failed to load holidays.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/holiday/create", formData);
      setShowForm(false);
      setFormData({
        holiday_name: "",
        holiday_date: "",
        description: ""
      });
      loadHolidays();
    } catch (err) {
      setError("Failed to create holiday.");
    }
  };

  const currentYear = new Date().getFullYear();
  const currentYearHolidays = holidays.filter(holiday =>
    new Date(holiday.holiday_date).getFullYear() === currentYear
  );

  return (
    <div>
      <h1>Holiday Calendar - {currentYear}</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: "20px", padding: "10px 20px" }}
      >
        {showForm ? "Cancel" : "Add Holiday"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #ccc" }}>
          <h3>Add Holiday</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label>Holiday Name *</label>
              <input
                type="text"
                name="holiday_name"
                value={formData.holiday_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Date *</label>
              <input
                type="date"
                name="holiday_date"
                value={formData.holiday_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: "10px" }}>Save Holiday</button>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading holidays...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Holiday Name</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {currentYearHolidays.map((holiday, idx) => (
                <tr key={idx}>
                  <td>{holiday.holiday_name || "—"}</td>
                  <td>{holiday.holiday_date || "—"}</td>
                  <td>{holiday.description || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HolidayCalendar;