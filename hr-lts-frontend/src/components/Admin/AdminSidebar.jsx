import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { FaGears } from "react-icons/fa6";

const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="px-4 py-4 border-b border-gray-700">
        <h3 className="font-bold text-lg">HR Leave System</h3>
        <p className="text-xs text-gray-400">Admin Portal</p>
      </div>
      <div className="px-2">
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span>Employees</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
        >
          <FaBuilding />
          <span>Departments</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/leaves"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
        >
          <FaCalendarAlt />
          <span>Leaves</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/settings"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
        >
          <FaGears />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
