import React from "react";
import SummaryCard from "./SummaryCard";
import { FaUsers } from "react-icons/fa";

const AdminSummary = () => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Dashboard Overview</h3>
      <div>
        <SummaryCard icon={<FaUsers />} title="Total Employees" value="1,234" />
      </div>
    </div>
  );
};

export default AdminSummary;
