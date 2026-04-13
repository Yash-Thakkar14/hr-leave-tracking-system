import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import API_BASE from "../../utils/api";

const leaveTypes = [
  { value: "sick", label: "Sick Leave" },
  { value: "casual", label: "Casual Leave" },
  { value: "annual", label: "Annual Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
];

const AddLeave = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/leaves/apply`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        navigate("/employee-dashboard/my-leaves");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B3668] px-8 py-5">
          <h2 className="text-xl font-bold text-white">Apply for Leave</h2>
          <p className="text-blue-200 text-sm mt-0.5">
            Submit a leave request for admin review
          </p>
        </div>

        <div className="p-8">
          <div
            className="flex items-center gap-2 bg-blue-50 border border-blue-100
                          rounded-lg px-4 py-2.5 mb-6"
          >
            <svg
              className="w-4 h-4 text-[#1B3668]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-[#1B3668]">
              Applying as:{" "}
              <strong>
                {user?.name ?? (
                  <span className="text-gray-400 font-normal">Loading…</span>
                )}
              </strong>
            </span>
          </div>

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
            {/* Leave type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Leave Type
              </label>
              <select
                name="leaveType"
                onChange={handleChange}
                value={form.leaveType}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                           focus:border-[#1B3668] transition-colors"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  value={form.startDate}
                  min={today}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                             focus:border-[#1B3668] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  value={form.endDate}
                  min={form.startDate || today}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                             focus:border-[#1B3668] transition-colors"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reason
              </label>
              <textarea
                name="reason"
                onChange={handleChange}
                value={form.reason}
                required
                rows={4}
                placeholder="Briefly describe the reason for your leave…"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                           focus:border-[#1B3668] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B3668] hover:bg-[#0f2040] text-white font-semibold
                         py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60
                         disabled:cursor-not-allowed text-sm shadow-sm"
            >
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeave;
