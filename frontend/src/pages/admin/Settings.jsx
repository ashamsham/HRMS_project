import React, { useState } from "react";
import api from "../../api/axios";

function Settings() {
  const [settings, setSettings] = useState({
    companyName: "HRMS Company",
    timezone: "UTC",
    currency: "USD",
    workingHours: "9 AM - 6 PM",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await api.post("/settings/update", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings");
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      {saved && <p className="success-text">Settings saved successfully!</p>}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={settings.companyName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Timezone</label>
          <select name="timezone" value={settings.timezone} onChange={handleChange}>
            <option>UTC</option>
            <option>EST</option>
            <option>CST</option>
            <option>PST</option>
          </select>
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select name="currency" value={settings.currency} onChange={handleChange}>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>INR</option>
          </select>
        </div>
        <div className="form-group">
          <label>Working Hours</label>
          <input
            type="text"
            name="workingHours"
            value={settings.workingHours}
            onChange={handleChange}
          />
        </div>
        <button className="btn-primary" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;

