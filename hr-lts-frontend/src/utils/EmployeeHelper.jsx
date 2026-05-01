import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";

export const columns = [
  { name: "S No", selector: (row) => row.sno, width: "80px" },
  { name: "Name", selector: (row) => row.name, sortable: true },
  { name: "Department", selector: (row) => row.dept_name },
  { name: "Action", selector: (row) => row.action },
];

export const fetchDepartments = async () => {
  try {
    const response = await axiosInstance.get("/api/departments");
    if (response.data.success) return response.data.departments;
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
        className="px-3 py-1.5 bg-[#1B3668] hover:bg-[#0f2040] text-white text-xs
                   font-medium rounded-lg transition-colors"
      >
        View
      </button>
      <button
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs
                   font-medium rounded-lg transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => navigate(`/admin-dashboard/employees/${Id}/leaves`)}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs
                   font-medium rounded-lg transition-colors"
      >
        Leaves
      </button>
    </div>
  );
};
