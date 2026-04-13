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
  const { id } = useParams(); // Employee _id
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
        const [empRes, leavesRes] = await Promise.all([
          axios.get(`${API_BASE}/api/employees/${id}`, { headers }),
          axios.get(`${API_BASE}/api/leaves/employee/${id}`, { headers }),
        ]);
        if (empRes.data.success) setEmployee(empRes.data.employee);
        if (leavesRes.data.success) {
          setLeaves(leavesRes.data.leaves);
          setBalance(leavesRes.data.balance);
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

  const empName = employee?.userId?.name || "Employee";

  return (
    <div className="p-6">
      {/* Back button */}
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

      {/* Header */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6
                      flex items-center gap-4"
      >
        <div
          className="w-12 h-12 rounded-full bg-[#1B3668] flex items-center justify-center
                        text-white font-bold text-lg flex-shrink-0"
        >
          {empName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1B3668]">{empName}</h2>
          <p className="text-sm text-gray-500">
            {employee?.designation} · {employee?.department?.dept_name}
          </p>
        </div>
      </div>

      {/* Balance cards */}
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

      {/* Leave history table */}
      <h3 className="text-xl font-bold text-[#1B3668] mb-4">Leave History</h3>

      {leaves.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <p className="text-gray-400">
            No leave applications found for {empName}.
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

      {/* Detail modal */}
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
