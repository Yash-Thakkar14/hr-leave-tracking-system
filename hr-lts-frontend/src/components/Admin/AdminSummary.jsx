import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";
import API_BASE from "../../utils/api";

const StatCard = ({ icon, title, value, iconBg }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 ${iconBg}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-[#1B3668]">{value ?? "—"}</p>
    </div>
  </div>
);

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/leaves/summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) setSummary(res.data.summary);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return <p className="p-6 text-gray-500">Loading dashboard…</p>;

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-[#1B3668] mb-6">
        Dashboard Overview
      </h3>

      {/* Organisation stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={<FaUsers />}
          title="Total Employees"
          value={summary.totalEmployees}
          iconBg="bg-[#1B3668]"
        />
        <StatCard
          icon={<FaBuilding />}
          title="Total Departments"
          value={summary.totalDepartments}
          iconBg="bg-yellow-600"
        />
      </div>

      {/* Leave stats */}
      <h4 className="text-lg font-bold text-[#1B3668] mb-4">Leave Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          icon={<FaFileAlt />}
          title="Total Applications"
          value={summary.totalLeaves}
          iconBg="bg-[#1B3668]"
        />
        <StatCard
          icon={<FaCheckCircle />}
          title="Approved"
          value={summary.approved}
          iconBg="bg-green-600"
        />
        <StatCard
          icon={<FaHourglassHalf />}
          title="Pending"
          value={summary.pending}
          iconBg="bg-yellow-500"
        />
        <StatCard
          icon={<FaTimesCircle />}
          title="Rejected"
          value={summary.rejected}
          iconBg="bg-red-600"
        />
      </div>
    </div>
  );
};

export default AdminSummary;
