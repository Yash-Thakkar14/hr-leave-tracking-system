import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import API_BASE from "../../utils/api";

const EditEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    designation: "",
    department: "",
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchDepartments().then(setDepartments);
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          const e = res.data.employee;
          setEmployee({
            name: e.userId.name,
            designation: e.designation,
            department: e.department?._id || e.department,
          });
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load employee.");
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE}/api/employees/${id}`, employee, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) navigate("/admin-dashboard/employees");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update employee.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "mt-1 p-2.5 block w-full border border-gray-300 rounded-lg text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40 focus:border-[#1B3668] transition-colors";

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <button
        onClick={() => navigate("/admin-dashboard/employees")}
        className="flex items-center gap-2 text-[#1B3668] hover:text-[#0f2040]
                   text-sm font-medium mb-5 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Employees
      </button>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-[#1B3668] px-8 py-5">
          <h2 className="text-xl font-bold text-white">Edit Employee</h2>
          <p className="text-blue-200 text-sm mt-0.5">
            Update employee information
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div
              className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200
                            text-red-700 rounded-lg px-4 py-3 text-sm"
            >
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {departments.length > 0 && employee.name ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={employee.designation}
                  onChange={handleChange}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  className={inputCls}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate("/admin-dashboard/employees")}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm
                             font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1B3668] hover:bg-[#0f2040] text-white font-semibold
                             py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60 text-sm"
                >
                  {loading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-500 text-sm">Loading employee data…</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
