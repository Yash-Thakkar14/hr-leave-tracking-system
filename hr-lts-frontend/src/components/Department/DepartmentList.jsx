import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import axiosInstance from "../../utils/axiosInstance";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDepartmentDelete = (id) => {
    setDepartments((prev) => prev.filter((d) => d._id !== id));
    setFilteredDepartments((prev) => prev.filter((d) => d._id !== id));
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/departments");
        if (res.data.success) {
          let sno = 1;
          const data = res.data.departments.map((dept) => ({
            _id: dept._id,
            sno: sno++,
            dept_name: dept.dept_name,
            action: (
              <DepartmentButtons
                _id={dept._id}
                onDepartmentDelete={onDepartmentDelete}
              />
            ),
          }));
          setDepartments(data);
          setFilteredDepartments(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const q = e.target.value.toLowerCase();
    setFilteredDepartments(
      departments.filter((d) => d.dept_name.toLowerCase().includes(q)),
    );
  };

  if (loading) return <p className="p-6 text-gray-500">Loading departments…</p>;

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#1B3668]">
          Manage Departments
        </h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search departments…"
          onChange={filterDepartments}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                     focus:border-[#1B3668] transition-colors w-64"
        />
        <Link
          to="/admin-dashboard/add-department"
          className="px-4 py-2 bg-[#1B3668] hover:bg-[#0f2040] text-white
                     text-sm font-semibold rounded-lg transition-colors"
        >
          Add New Department
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredDepartments}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default DepartmentList;
