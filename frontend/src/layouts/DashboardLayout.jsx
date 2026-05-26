import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="dashboard-content">
          <h1>HRMS Dashboard</h1>
          <p>Welcome Admin</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;