import React from "react";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";

export const columns = [
  { name: "S No", selector: (row) => row.sno, width: "80px" },
  { name: "Department Name", selector: (row) => row.dept_name, sortable: true },
  { name: "Action", selector: (row) => row.action },
];

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Delete this department? This cannot be undone."))
      return;
    try {
      const res = await axiosInstance.delete(`/api/departments/${_id}`);
      if (res.data.success) onDepartmentDelete(_id);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete department.");
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
        className="px-3 py-1.5 bg-[#1B3668] hover:bg-[#0f2040] text-white text-xs
                   font-medium rounded-lg transition-colors"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs
                   font-medium rounded-lg transition-colors"
      >
        Delete
      </button>
    </div>
  );
};
