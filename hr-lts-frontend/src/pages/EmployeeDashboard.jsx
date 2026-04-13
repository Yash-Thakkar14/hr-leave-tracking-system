import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCalendarPlus, FaListAlt } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";

const EmployeeDashboard = () => {
  return (
    <div className="flex">
      <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
        <div className="px-4 py-4 border-b border-gray-700">
          <h3 className="font-bold text-lg">HR Leave System</h3>
          <p className="text-xs text-gray-400">Employee Portal</p>
        </div>
        <div className="px-2">
          <NavLink
            to="/employee-dashboard"
            end
            className={({ isActive }) =>
              `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-3 py-2.5 px-4 rounded`
            }
          >
            <FaTachometerAlt />
            <span>My Leaves</span>
          </NavLink>
          <NavLink
            to="/employee-dashboard/apply"
            className={({ isActive }) =>
              `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-3 py-2.5 px-4 rounded`
            }
          >
            <FaCalendarPlus />
            <span>Apply for Leave</span>
          </NavLink>
        </div>
      </div>

      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
