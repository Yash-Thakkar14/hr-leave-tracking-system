import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../../utils/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100  text-green-800",
  rejected: "bg-red-100    text-red-800",
};

const DetailRow = ({ label, children }) => (
  <div className="flex gap-3">
    <span className="w-36 flex-shrink-0 text-gray-500 text-sm font-medium">
      {label}
    </span>
    <span className="text-gray-800 text-sm">{children}</span>
  </div>
);

const EmployeeLeaves = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [empRes, leavesRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/api/employees/${id}`, { headers }),
          axios.get(`${API_BASE}/api/leaves/employee/${id}`, { headers }),
        ]);

        if (empRes.status === "fulfilled" && empRes.value.data.success)
          setEmployee(empRes.value.data.employee);

        if (leavesRes.status === "fulfilled" && leavesRes.value.data.success) {
          setLeaves(leavesRes.value.data.leaves);
          setBalance(leavesRes.value.data.balance);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading…</p>;

  const empName =
    employee?.userId?.name || employee?.name || "Unknown Employee";

  const designation = employee?.designation || "";
  const department = employee?.department?.dept_name || "";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/admin-dashboard/employees")}
        className="flex items-center gap-2 text-[#1B3668] hover:text-[#0f2040]
                   text-sm font-medium mb-6 transition-colors"
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

      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 mb-6
                      flex items-center gap-3"
      >
        <div
          className="w-10 h-10 rounded-full bg-[#1B3668] flex items-center justify-center
                        text-white font-bold text-base flex-shrink-0"
        >
          {empName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-base font-bold text-[#1B3668]">{empName}</h2>
          {(designation || department) && (
            <p className="text-xs text-gray-500">
              {[designation, department].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {balance && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Leave Balance — {balance.year}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["sick", "casual", "annual", "unpaid"].map((type) => {
              const remaining =
                type === "unpaid"
                  ? "∞"
                  : balance[type].total - balance[type].used;
              return (
                <div
                  key={type}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {type}
                  </p>
                  <p className="text-2xl font-bold text-[#1B3668]">
                    {remaining}
                  </p>
                  {type !== "unpaid" && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      of {balance[type].total} remaining
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold text-[#1B3668] mb-4">Leave History</h3>

      {leaves.length === 0 ? (
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100
                        py-16 px-8 text-center"
        >
          <div
            className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center
                          mx-auto mb-4"
          >
            <svg
              className="w-7 h-7 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25
                   2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021
                   18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">
            No leave applications found
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {empName} has not applied for any leave yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-[#1B3668] text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left w-8">#</th>
                <th className="px-4 py-3 text-left w-24">Type</th>
                <th className="px-4 py-3 text-left w-28">From</th>
                <th className="px-4 py-3 text-left w-28">To</th>
                <th className="px-4 py-3 text-left w-12">Days</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((leave, i) => (
                <tr
                  key={leave._id}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => setDetail(leave)}
                >
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 capitalize font-medium">
                    {leave.leaveType}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{leave.totalDays}</td>
                  <td className="px-4 py-3 truncate max-w-0 text-gray-600">
                    {leave.reason}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                                     ${statusColors[leave.status]}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 px-4 py-2">
            Click any row to view details
          </p>
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center
                     justify-center z-50 px-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1B3668] px-6 py-4 flex items-center justify-between">
              <h4 className="text-white font-bold text-lg">Leave Details</h4>
              <button
                onClick={() => setDetail(null)}
                className="text-white/70 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="Employee">
                <span className="font-medium">{empName}</span>
              </DetailRow>
              <DetailRow label="Leave Type">
                <span className="capitalize font-medium">
                  {detail.leaveType}
                </span>
              </DetailRow>
              <DetailRow label="From">
                {new Date(detail.startDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DetailRow>
              <DetailRow label="To">
                {new Date(detail.endDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DetailRow>
              <DetailRow label="Working Days">{detail.totalDays}</DetailRow>
              <DetailRow label="Status">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold
                                  ${statusColors[detail.status]}`}
                >
                  {detail.status}
                </span>
              </DetailRow>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1.5">
                  Reason
                </p>
                <p
                  className="text-gray-800 text-sm bg-gray-50 border border-gray-100
                              rounded-lg p-3 leading-relaxed"
                >
                  {detail.reason || "—"}
                </p>
              </div>
              {detail.adminComment && (
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1.5">
                    Admin Comment
                  </p>
                  <p
                    className="text-gray-800 text-sm bg-blue-50 border border-blue-100
                                rounded-lg p-3 leading-relaxed"
                  >
                    {detail.adminComment}
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setDetail(null)}
                className="w-full py-2.5 bg-[#1B3668] hover:bg-[#0f2040] text-white
                           rounded-lg text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaves;
