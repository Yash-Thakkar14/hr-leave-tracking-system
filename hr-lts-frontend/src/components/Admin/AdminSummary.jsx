import React, { useEffect, useState } from "react";
import SummaryCard from "../SummaryCard";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/leaves/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (res.data.success) setSummary(res.data.summary);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          title="Total Employees"
          value={summary.totalEmployees}
          color="bg-teal-700"
        />
        <SummaryCard
          icon={<FaBuilding />}
          title="Total Departments"
          value={summary.totalDepartments}
          color="bg-yellow-600"
        />
      </div>
      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Leave Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard
            icon={<FaFileAlt />}
            title="Leave Applications"
            value={summary.totalLeaves}
            color="bg-teal-700"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            title="Leave Approved"
            value={summary.approved}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            title="Leave Pending"
            value={summary.pending}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            title="Leave Rejected"
            value={summary.rejected}
            color="bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
