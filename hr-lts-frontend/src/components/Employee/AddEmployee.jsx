import React, { useState, useEffect } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE from "../../utils/api";

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deptLoading, setDeptLoading] = useState(true);

  const navigate = useNavigate();

  // ── FIX: handle department fetch failures so the form stays usable ──
  useEffect(() => {
    const getDepartments = async () => {
      setDeptLoading(true);
      try {
        const depts = await fetchDepartments();
        setDepartments(depts || []);
      } catch (err) {
        setError("Could not load departments. Please refresh the page.");
      } finally {
        setDeptLoading(false);
      }
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/employees/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (err) {
      // ── FIX: was silently console.log'ing — now shown to user ──
      setError(
        err.response?.data?.error ||
          "Failed to add employee. Please check all fields and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "mt-1 p-2.5 block w-full border border-gray-300 rounded-lg text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40 focus:border-[#1B3668] transition-colors";

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B3668] px-8 py-5">
          <h2 className="text-xl font-bold text-white">Add New Employee</h2>
          <p className="text-blue-200 text-sm mt-0.5">
            Create a new employee account and profile
          </p>
        </div>

        <div className="p-8">
          {/* Error banner */}
          {error && (
            <div
              className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200
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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  placeholder="Full name"
                  className={inputCls}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={inputCls}
                  required
                />
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  onChange={handleChange}
                  placeholder="e.g. EMP-001"
                  className={inputCls}
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  onChange={handleChange}
                  defaultValue=""
                  className={inputCls}
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className={inputCls}
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  name="department"
                  onChange={handleChange}
                  defaultValue=""
                  className={inputCls}
                  required
                  disabled={deptLoading}
                >
                  <option value="" disabled>
                    {deptLoading ? "Loading departments…" : "Select Department"}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={inputCls}
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  onChange={handleChange}
                  defaultValue=""
                  className={inputCls}
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
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
                disabled={loading || deptLoading}
                className="flex-1 bg-[#1B3668] hover:bg-[#0f2040] text-white font-semibold
                           py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60
                           text-sm shadow-sm"
              >
                {loading ? "Adding Employee…" : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
