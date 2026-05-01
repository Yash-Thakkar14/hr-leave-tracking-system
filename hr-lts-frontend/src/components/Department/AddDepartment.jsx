import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dept_name: "",
    dept_description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/departments/add",
        department,
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Failed to add department. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B3668] px-8 py-5">
          <h2 className="text-xl font-bold text-white">Add Department</h2>
          <p className="text-blue-200 text-sm mt-0.5">
            Create a new department in the organisation
          </p>
        </div>

        <div className="p-8">
          {/* Error */}
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="dept_name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Department Name
              </label>
              <input
                type="text"
                id="dept_name"
                name="dept_name"
                value={department.dept_name}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                           focus:border-[#1B3668] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="dept_description"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Description{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="dept_description"
                name="dept_description"
                value={department.dept_description}
                onChange={handleChange}
                placeholder="Brief description of the department…"
                rows={3}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                           focus:border-[#1B3668] transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate("/admin-dashboard/departments")}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm
                           font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#1B3668] hover:bg-[#0f2040] text-white font-semibold
                           py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60
                           text-sm shadow-sm"
              >
                {loading ? "Adding…" : "Add Department"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
