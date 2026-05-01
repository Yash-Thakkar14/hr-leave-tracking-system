import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, EmployeeButtons } from "../../utils/EmployeeHelper";
import axiosInstance from "../../utils/axiosInstance";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/api/employees");
        if (res.data.success) {
          let sno = 1;
          const data = res.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            name: emp.userId?.name || "—",
            dept_name: emp.department?.dept_name || "—",
            action: <EmployeeButtons Id={emp._id} />,
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const q = e.target.value.toLowerCase();
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.dept_name.toLowerCase().includes(q),
      ),
    );
  };

  if (loading) return <p className="p-6 text-gray-500">Loading employees…</p>;

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#1B3668]">Manage Employees</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search employees…"
          onChange={handleFilter}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                     focus:border-[#1B3668] transition-colors w-64"
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-2 bg-[#1B3668] hover:bg-[#0f2040] text-white
                     text-sm font-semibold rounded-lg transition-colors"
        >
          Add New Employee
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          pagination
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default EmployeeList;
