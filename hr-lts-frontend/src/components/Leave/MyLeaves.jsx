import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100  text-green-800",
  rejected: "bg-red-100    text-red-800",
};

const DetailRow = ({ label, children }) => (
  <div className="flex gap-3">
    <span className="w-32 flex-shrink-0 text-gray-500 text-sm font-medium">
      {label}
    </span>
    <span className="text-gray-800 text-sm">{children}</span>
  </div>
);

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailLeave, setDetailLeave] = useState(null);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [leavesRes, balanceRes] = await Promise.all([
        axiosInstance.get("/api/leaves/my-leaves"),
        axiosInstance.get("/api/leaves/my-balance"),
      ]);
      if (leavesRes.data.success) setLeaves(leavesRes.data.leaves);
      if (balanceRes.data.success) setBalance(balanceRes.data.balance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading…</p>;

  return (
    <div className="p-6">
      {balance && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#1B3668]">
              Leave Balance — {balance.year}
            </h3>
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="px-3 py-1.5 text-sm bg-[#1B3668] text-white rounded-lg hover:bg-[#0f2040] disabled:opacity-50 transition-colors"
            >
              {refreshing ? "Refreshing…" : "↻ Refresh"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["sick", "casual", "annual", "unpaid"].map((type) => {
              const remaining =
                type === "unpaid"
                  ? "∞"
                  : balance[type].total - balance[type].used;
              const pct =
                type === "unpaid"
                  ? 100
                  : Math.round(
                      ((balance[type].total - balance[type].used) /
                        balance[type].total) *
                        100,
                    );
              const barColor =
                pct > 60
                  ? "bg-green-400"
                  : pct > 30
                    ? "bg-yellow-400"
                    : "bg-red-400";
              return (
                <div
                  key={type}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center"
                >
                  <p className="text-xs text-gray-500 capitalize mb-1 font-medium tracking-wide uppercase">
                    {type}
                  </p>
                  <p className="text-3xl font-bold text-[#1B3668]">
                    {remaining}
                  </p>
                  {type !== "unpaid" && (
                    <>
                      <p className="text-xs text-gray-400 mt-1">
                        of {balance[type].total} remaining
                      </p>
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold text-[#1B3668] mb-4">
        My Leave History
      </h3>

      {leaves.length === 0 ? (
        <p className="text-gray-500">No leave applications yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-[#1B3668] text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left w-8">#</th>
                <th className="px-4 py-3 text-left w-24">Type</th>
                <th className="px-4 py-3 text-left w-24">From</th>
                <th className="px-4 py-3 text-left w-24">To</th>
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
                  onClick={() => setDetailLeave(leave)}
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
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[leave.status]}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 px-4 py-2">
            Click any row to view full details
          </p>
        </div>
      )}

      {detailLeave && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 px-4"
          onClick={() => setDetailLeave(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1B3668] px-6 py-4 flex items-center justify-between">
              <h4 className="text-white font-bold text-lg">Leave Details</h4>
              <button
                onClick={() => setDetailLeave(null)}
                className="text-white/70 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="Leave Type">
                <span className="capitalize font-medium">
                  {detailLeave.leaveType}
                </span>
              </DetailRow>
              <DetailRow label="From">
                {new Date(detailLeave.startDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DetailRow>
              <DetailRow label="To">
                {new Date(detailLeave.endDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DetailRow>
              <DetailRow label="Working Days">
                {detailLeave.totalDays}
              </DetailRow>
              <DetailRow label="Status">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[detailLeave.status]}`}
                >
                  {detailLeave.status}
                </span>
              </DetailRow>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Reason</p>
                <p className="text-gray-800 text-sm bg-gray-50 border border-gray-100 rounded-lg p-3 leading-relaxed">
                  {detailLeave.reason || "—"}
                </p>
              </div>
              {detailLeave.adminComment ? (
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Admin Comment
                  </p>
                  <p className="text-gray-800 text-sm bg-blue-50 border border-blue-100 rounded-lg p-3 leading-relaxed">
                    {detailLeave.adminComment}
                  </p>
                </div>
              ) : (
                detailLeave.status !== "pending" && (
                  <DetailRow label="Admin Comment">
                    <span className="text-gray-400">No comment provided</span>
                  </DetailRow>
                )
              )}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setDetailLeave(null)}
                className="w-full py-2.5 bg-[#1B3668] hover:bg-[#0f2040] text-white rounded-lg text-sm font-semibold transition-colors"
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

export default MyLeaves;
