import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  { name: "S No", selector: (row) => row.sno },
  { name: "Name", selector: (row) => row.name, sortable: true },
  { name: "Department", selector: (row) => row.dept_name },
  { name: "Action", selector: (row) => row.action },
];

export const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/departments", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.data.success) return response.data.departments;
    return [];
  } catch (error) {
    if (error.response && !error.response.data.success) {
      console.log(error.response.data.error);
    }
    return [];
  }
};

export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();
  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-700 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
      >
        View
      </button>
      <button
        className="px-3 py-1 bg-blue-700 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
      >
        Edit
      </button>
      <button className="px-3 py-1 bg-red-700 text-white">Leaves</button>
    </div>
  );
};
