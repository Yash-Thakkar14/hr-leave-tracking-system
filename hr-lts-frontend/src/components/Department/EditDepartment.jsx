import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState({
    dept_name: "",
    dept_description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await axiosInstance.get(`/api/departments/${id}`);
        if (res.data.success) {
          setDepartment({
            dept_name: res.data.department.dept_name || "",
            dept_description: res.data.department.dept_description || "",
          });
        }
      } catch (err) {
        setError("Failed to load department.");
      }
    };
    fetchDepartment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/api/departments/${id}`, department);
      if (res.data.success) navigate("/admin-dashboard/departments");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update department.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "mt-1 p-2.5 block w-full border border-gray-300 rounded-lg text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40 focus:border-[#1B3668] transition-colors";

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <button
        onClick={() => navigate("/admin-dashboard/departments")}
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
        Back to Departments
      </button>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-[#1B3668] px-8 py-5">
          <h2 className="text-xl font-bold text-white">Edit Department</h2>
          <p className="text-blue-200 text-sm mt-0.5">
            Update department details
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department Name
              </label>
              <input
                type="text"
                name="dept_name"
                value={department.dept_name}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="dept_description"
                value={department.dept_description}
                onChange={handleChange}
                rows={3}
                className={inputCls + " resize-none"}
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
                           py-2.5 rounded-lg transition-colors disabled:opacity-60 text-sm"
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
