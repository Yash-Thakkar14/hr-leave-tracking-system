import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Field = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-gray-800 font-semibold">{value || "—"}</p>
  </div>
);

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axiosInstance.get(`/api/employees/${id}`);
        if (response.data.success) setEmployee(response.data.employee);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee)
    return <p className="p-6 text-gray-500">Loading employee details…</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
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

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B3668] px-8 py-6 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center
                          text-white font-bold text-2xl flex-shrink-0"
          >
            {employee.userId.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {employee.userId.name}
            </h2>
            <p className="text-blue-200 text-sm mt-0.5">
              {employee.designation} · {employee.department?.dept_name}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" value={employee.userId.name} />
          <Field label="Email" value={employee.userId.email} />
          <Field label="Employee ID" value={employee.employeeId} />
          <Field label="Gender" value={employee.gender} />
          <Field label="Designation" value={employee.designation} />
          <Field label="Department" value={employee.department?.dept_name} />
          <Field label="Role" value={employee.userId.role} />
          <Field
            label="Joined"
            value={new Date(employee.createdAt).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={() => navigate(`/admin-dashboard/employees/edit/${id}`)}
            className="flex-1 py-2.5 bg-[#1B3668] hover:bg-[#0f2040] text-white
                       text-sm font-semibold rounded-lg transition-colors"
          >
            Edit Employee
          </button>
          <button
            onClick={() => navigate(`/admin-dashboard/employees/${id}/leaves`)}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white
                       text-sm font-semibold rounded-lg transition-colors"
          >
            View Leaves
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
