import React, { useEffect, useState } from "react";
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

const employeeName = (emp) => {
  if (!emp) return "Unknown";
  if (emp.name && emp.name.trim()) return emp.name;
  if (emp.email) return emp.email;
  return "Unknown";
};

// ── MR05: Urgency logic ───────────────────────────────────────────────────
const getUrgency = (leave) => {
  if (leave.status !== "pending") return null;
  const now = new Date();
  const startDate = new Date(leave.startDate);
  const created = new Date(leave.createdAt);
  const daysUntilStart = (startDate - now) / (1000 * 60 * 60 * 24);
  const daysSinceSubmit = (now - created) / (1000 * 60 * 60 * 24);

  if (daysUntilStart <= 2)
    return {
      label: "Starting Soon",
      color: "bg-red-100 text-red-700 border border-red-200",
    };
  if (daysSinceSubmit >= 5)
    return {
      label: "Awaiting Review",
      color: "bg-orange-100 text-orange-700 border border-orange-200",
    };
  return null;
};

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailLeave, setDetailLeave] = useState(null);
  const [modal, setModal] = useState(null);
  const [comment, setComment] = useState("");

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const fetchLeaves = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get(`${API_BASE}/api/leaves`, { headers });
      if (res.data.success) setLeaves(res.data.leaves);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/leaves/${modal.leaveId}/status`,
        { status: modal.action, adminComment: comment },
        { headers },
      );
      if (res.data.success) {
        setLeaves((prev) =>
          prev.map((l) =>
            l._id === modal.leaveId ? { ...l, ...res.data.leave } : l,
          ),
        );
        setModal(null);
        setComment("");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const openAction = (leaveId, action) => {
    setDetailLeave(null);
    setModal({ leaveId, action });
  };

  if (loading) return <p className="p-6 text-gray-500">Loading…</p>;

  // Count urgent for header badge
  const urgentCount = leaves.filter((l) => getUrgency(l)).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-[#1B3668]">Leave Requests</h3>
          {urgentCount > 0 && (
            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
              {urgentCount} urgent
            </span>
          )}
        </div>
        <button
          onClick={fetchLeaves}
          disabled={refreshing}
          className="px-3 py-1.5 text-sm bg-[#1B3668] text-white rounded-lg hover:bg-[#0f2040] disabled:opacity-50 transition-colors"
        >
          {refreshing ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {leaves.length === 0 ? (
        <p className="text-gray-500">No leave requests found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1B3668] text-white text-xs uppercase">
              <tr>
                <th className="px-3 py-3 text-left w-8">#</th>
                <th className="px-3 py-3 text-left w-36">Employee</th>
                <th className="px-3 py-3 text-left w-24">Type</th>
                <th className="px-3 py-3 text-left w-24">From</th>
                <th className="px-3 py-3 text-left w-24">To</th>
                <th className="px-3 py-3 text-left w-12">Days</th>
                <th className="px-3 py-3 text-left w-28">Status</th>
                <th className="px-3 py-3 text-left w-36">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((leave, i) => {
                const urgency = getUrgency(leave);
                return (
                  <tr
                    key={leave._id}
                    className={`hover:bg-blue-50 cursor-pointer transition-colors ${urgency ? "bg-red-50/30" : ""}`}
                    onClick={() => setDetailLeave(leave)}
                  >
                    <td className="px-3 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium truncate">
                        {employeeName(leave.employee)}
                      </div>
                      {/* ── MR05: Urgency badge ── */}
                      {urgency && (
                        <span
                          className={`inline-block mt-0.5 px-1.5 py-0.5 text-xs font-semibold rounded ${urgency.color}`}
                        >
                          ⚡ {urgency.label}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 capitalize">{leave.leaveType}</td>
                    <td className="px-3 py-3">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">{leave.totalDays}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[leave.status]}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td
                      className="px-3 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {leave.status === "pending" ? (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => openAction(leave._id, "approved")}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openAction(leave._id, "rejected")}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Reviewed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 px-4 py-2">
            Click any row to view full details
          </p>
        </div>
      )}

      {/* ── Detail modal ── */}
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
              <h4 className="text-white font-bold text-lg">
                Leave Request Details
              </h4>
              <button
                onClick={() => setDetailLeave(null)}
                className="text-white/70 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="Employee">
                <span className="font-medium">
                  {employeeName(detailLeave.employee)}
                </span>
              </DetailRow>
              <DetailRow label="Leave Type">
                <span className="capitalize">{detailLeave.leaveType}</span>
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
              {getUrgency(detailLeave) && (
                <DetailRow label="Urgency">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${getUrgency(detailLeave).color}`}
                  >
                    ⚡ {getUrgency(detailLeave).label}
                  </span>
                </DetailRow>
              )}
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1.5">
                  Reason
                </p>
                <p className="text-gray-800 text-sm bg-gray-50 border border-gray-100 rounded-lg p-3 leading-relaxed">
                  {detailLeave.reason || "—"}
                </p>
              </div>
              {detailLeave.adminComment && (
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1.5">
                    Admin Comment
                  </p>
                  <p className="text-gray-800 text-sm bg-blue-50 border border-blue-100 rounded-lg p-3 leading-relaxed">
                    {detailLeave.adminComment}
                  </p>
                </div>
              )}
            </div>
            {detailLeave.status === "pending" ? (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => openAction(detailLeave._id, "approved")}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => openAction(detailLeave._id, "rejected")}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="px-6 pb-6">
                <button
                  onClick={() => setDetailLeave(null)}
                  className="w-full py-2.5 bg-[#1B3668] hover:bg-[#0f2040] text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Confirm modal ── */}
      {modal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 px-4"
          onClick={() => {
            setModal(null);
            setComment("");
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`px-6 py-4 flex items-center justify-between ${modal.action === "approved" ? "bg-green-600" : "bg-red-600"}`}
            >
              <h4 className="text-white font-bold text-lg">
                {modal.action === "approved" ? "✓ Approve" : "✕ Reject"} Leave
                Request
              </h4>
              <button
                onClick={() => {
                  setModal(null);
                  setComment("");
                }}
                className="text-white/70 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-3">
                Optional comment for the employee:
              </p>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Approved — enjoy your leave…"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40 focus:border-[#1B3668] transition-colors resize-none"
              />
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => {
                  setModal(null);
                  setComment("");
                }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className={`flex-1 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors ${modal.action === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                Confirm {modal.action === "approved" ? "Approval" : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveList;
