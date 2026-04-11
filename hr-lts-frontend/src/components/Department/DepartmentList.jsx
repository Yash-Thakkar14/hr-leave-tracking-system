import React from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns } from "../utils/DepartmentHelper";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { DepartmentButtons } from "../utils/DepartmentHelper";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const onDepartmentDelete = (id) => {
    setDepartments((prev) => prev.filter((dept) => dept._id !== id));
    setFilteredDepartments((prev) => prev.filter((dept) => dept._id !== id));
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/departments",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.departments.map((dept) => ({
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
      } catch (error) {
        if (error.response && !error.response.data.success) {
          console.log(error.response.data.error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const records = departments.filter((dept) =>
      dept.dept_name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredDepartments(records);
  };

  return (
    <>
      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <div className="p-5">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Departments</h3>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search departments..."
              className="px-4 py-0.5 border"
              onChange={filterDepartments}
            />
            <Link
              to="/admin-dashboard/add-department"
              className="px-4 py-1 bg-teal-700 rounded text-white"
            >
              Add New Department
            </Link>
          </div>

          <div className="mt-5">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
