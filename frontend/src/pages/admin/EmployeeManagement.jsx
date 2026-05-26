import React, { useEffect, useState } from "react";
import { employeeService } from "../../services/employeeService";
import "./EmployeeManagement.css";

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    department: "",
    designation: "",
    joining_date: "",
    contact_number: "",
    reporting_manager: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({
      full_name: "",
      email: "",
      department: "",
      designation: "",
      joining_date: "",
      contact_number: "",
      reporting_manager: "",
      password: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (employee) => {
    setIsEditing(true);
    setEditingId(employee.employee_id || employee.id);
    setFormData({
      full_name: employee.full_name || employee.name || "",
      email: employee.email || "",
      department: employee.department || "",
      designation: employee.designation || employee.position || "",
      joining_date: employee.joining_date || "",
      contact_number: employee.contact_number || "",
      reporting_manager: employee.reporting_manager || "",
      password: "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await employeeService.updateEmployee(editingId, formData);
        alert("Employee updated successfully!");
      } else {
        await employeeService.addEmployee(formData);
        alert("Employee added successfully!");
      }
      setShowModal(false);
      loadEmployees();
    } catch (err) {
      setError("Failed to save employee: " + err.message);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(employeeId);
        setEmployees(employees.filter((e) => (e.employee_id || e.id) !== employeeId));
        alert("Employee deleted successfully!");
      } catch (err) {
        setError("Failed to delete employee: " + err.message);
      }
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Employee Management</h1>
        <button className="btn-primary" onClick={handleAddClick}>
          + Add Employee
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.employee_id || emp.id}>
                  <td>{emp.employee_id || emp.id}</td>
                  <td>{emp.full_name || emp.name || "—"}</td>
                  <td>{emp.email || "—"}</td>
                  <td>{emp.department || "—"}</td>
                  <td>{emp.designation || emp.position || "—"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-small btn-edit"
                        onClick={() => handleEditClick(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDeleteEmployee(emp.employee_id || emp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Edit Employee" : "Add New Employee"}</h2>
            <form>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Joining Date *</label>
                <input
                  type="date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Reporting Manager</label>
                <input
                  type="text"
                  name="reporting_manager"
                  value={formData.reporting_manager}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Password {isEditing ? "(leave blank to keep current)" : "*"}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!isEditing}
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={handleSave}>
                  {isEditing ? "Update" : "Add"} Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;
