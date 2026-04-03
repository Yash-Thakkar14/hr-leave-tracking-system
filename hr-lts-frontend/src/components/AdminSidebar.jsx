import React from "react";
import { NavLink } from "react-router-dom";
import { FaCalendarAlt, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";

const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div>
        <h3>HR Leave Tracking System</h3>
      </div>
      <div>
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaTachometerAlt />
          <span> Dashboard</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span> Employees</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaCalendarAlt />
          <span> Leaves</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500" : "hover:bg-gray-600"} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaGears />
          <span> Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
