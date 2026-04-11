import React from "react";
import SummaryCard from "./SummaryCard";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

const AdminSummary = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          title="Total Employees"
          value={1000}
          color="bg-teal-700"
        />
        <SummaryCard
          icon={<FaBuilding />}
          title="Total Departments"
          value={50}
          color="bg-yellow-600"
        />
      </div>
      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Leave Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard
            icon={<FaFileAlt />}
            title="Leave Applications"
            value={10}
            color="bg-teal-700"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            title="Leave Approved"
            value={5}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            title="Leave Pending"
            value={2}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            title="Leave Rejected"
            value={1}
            color="bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
