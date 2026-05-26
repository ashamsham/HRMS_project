import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function PayrollManagement() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState({});

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get("/employee/all");
      setEmployees(response.data || []);
      // Initialize payroll data
      const data = {};
      response.data.forEach(emp => {
        data[emp.employee_id] = {
          payroll_month: new Date().toISOString().slice(0, 7), // YYYY-MM
          basic_salary: "",
          allowances: "",
          tax: "",
          pf: "",
          total_salary: 0,
          status: "pending",
          generated_date: new Date().toISOString().slice(0, 10)
        };
      });
      setPayrollData(data);
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (employeeId, field, value) => {
    setPayrollData(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value
      }
    }));
    // Recalculate total if relevant fields change
    if (["basic_salary", "allowances", "tax", "pf"].includes(field)) {
      setPayrollData(prev => {
        const data = prev[employeeId];
        const basic = parseFloat(data.basic_salary) || 0;
        const allowances = parseFloat(data.allowances) || 0;
        const tax = parseFloat(data.tax) || 0;
        const pf = parseFloat(data.pf) || 0;
        const total = basic + allowances - tax - pf;
        return {
          ...prev,
          [employeeId]: {
            ...data,
            total_salary: total
          }
        };
      });
    }
  };

  const handleSubmit = async (employeeId) => {
    try {
      const data = payrollData[employeeId];
      const payload = {
        employee_id: employeeId,
        payroll_month: data.payroll_month,
        basic_salary: parseFloat(data.basic_salary) || 0,
        allowances: parseFloat(data.allowances) || 0,
        deductions: 0, // Assuming no deductions field
        tax: parseFloat(data.tax) || 0,
        pf: parseFloat(data.pf) || 0,
        status: data.status,
        generated_date: data.generated_date
      };

      await api.post("/payroll/generate", payload);
      // Reset or something
      alert("Payroll generated successfully.");
    } catch (err) {
      setError("Failed to generate payroll.");
    }
  };

  return (
    <div>
      <h1>Payroll Management</h1>
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
                <th>Month</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Tax</th>
                <th>PF</th>
                <th>Total Salary</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.employee_id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>
                    <input
                      type="month"
                      value={payrollData[emp.employee_id]?.payroll_month || ""}
                      onChange={(e) => handleInputChange(emp.employee_id, "payroll_month", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={payrollData[emp.employee_id]?.basic_salary || ""}
                      onChange={(e) => handleInputChange(emp.employee_id, "basic_salary", e.target.value)}
                      step="0.01"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={payrollData[emp.employee_id]?.allowances || ""}
                      onChange={(e) => handleInputChange(emp.employee_id, "allowances", e.target.value)}
                      step="0.01"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={payrollData[emp.employee_id]?.tax || ""}
                      onChange={(e) => handleInputChange(emp.employee_id, "tax", e.target.value)}
                      step="0.01"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={payrollData[emp.employee_id]?.pf || ""}
                      onChange={(e) => handleInputChange(emp.employee_id, "pf", e.target.value)}
                      step="0.01"
                    />
                  </td>
                  <td>{payrollData[emp.employee_id]?.total_salary?.toFixed(2) || "0.00"}</td>
                  <td>
                    <select
                      value={payrollData[emp.employee_id]?.status || "pending"}
                      onChange={(e) => handleInputChange(emp.employee_id, "status", e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="date"
                      value={payrollData[emp.employee_id]?.generated_date || ""}
                      onChange={(e) => handleInputChange(emp.employee_id, "generated_date", e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSubmit(emp.employee_id)}>Generate</button>
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

export default PayrollManagement;