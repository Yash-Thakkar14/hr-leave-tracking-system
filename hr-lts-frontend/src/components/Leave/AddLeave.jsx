import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axiosInstance from "../../utils/axiosInstance";

const leaveTypes = [
  { value: "sick", label: "Sick Leave" },
  { value: "casual", label: "Casual Leave" },
  { value: "annual", label: "Annual Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
];

const calcWorkingDays = (start, end) => {
  let count = 0;
  const cur = new Date(start);
  while (cur <= new Date(end)) {
    const d = cur.getDay();
    if (d !== 0 && d !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

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
  const [balance, setBalance] = useState(null);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/leaves/my-balance")
      .then((r) => {
        if (r.data.success) setBalance(r.data.balance);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const w = [];
    if (!form.leaveType || !balance) {
      setWarnings([]);
      return;
    }
    const capped = ["sick", "casual", "annual"];
    if (capped.includes(form.leaveType)) {
      const pool = balance[form.leaveType];
      const remaining = pool.total - pool.used;
      if (remaining === 0) {
        w.push({
          level: "red",
          msg: `You have no ${form.leaveType} leave remaining for this year.`,
        });
      } else if (remaining <= 3) {
        w.push({
          level: "yellow",
          msg: `Only ${remaining} ${form.leaveType} day(s) remaining — plan carefully.`,
        });
      }
      if (form.startDate && form.endDate) {
        const days = calcWorkingDays(form.startDate, form.endDate);
        if (days > remaining) {
          w.push({
            level: "red",
            msg: `You are requesting ${days} day(s) but only have ${remaining} remaining.`,
          });
        }
      }
    }
    if (form.leaveType === "sick" && balance.sick.used >= 3) {
      w.push({
        level: "yellow",
        msg: `You have taken ${balance.sick.used} sick day(s) this year. Frequent sick leave may be reviewed by HR.`,
      });
    }
    setWarnings(w);
  }, [form.leaveType, form.startDate, form.endDate, balance]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/leaves/apply", form);
      if (res.data.success) navigate("/employee-dashboard/my-leaves");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const inputCls =
    "w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40 focus:border-[#1B3668] transition-colors";

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-[#1B3668] px-8 py-5">
          <h2 className="text-xl font-bold text-white">Apply for Leave</h2>
          <p className="text-blue-200 text-sm mt-0.5">
            Submit a leave request for admin review
          </p>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-5">
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
              Applying as: <strong>{user?.name ?? "Loading…"}</strong>
            </span>
          </div>

          {warnings.map((w, i) => (
            <div
              key={i}
              className={`mb-3 flex items-start gap-2 rounded-lg px-4 py-3 text-sm border ${w.level === "red" ? "bg-red-50 border-red-200 text-red-700" : "bg-yellow-50 border-yellow-200 text-yellow-800"}`}
            >
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {w.msg}
            </div>
          ))}

          {error && (
            <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
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
                Leave Type
              </label>
              <select
                name="leaveType"
                onChange={handleChange}
                value={form.leaveType}
                required
                className={inputCls}
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
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
                  className={inputCls}
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
                  className={inputCls}
                />
              </div>
            </div>
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
                className={inputCls + " resize-none"}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B3668] hover:bg-[#0f2040] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60 text-sm"
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
