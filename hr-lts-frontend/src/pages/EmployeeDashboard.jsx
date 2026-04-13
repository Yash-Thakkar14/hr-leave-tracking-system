import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaCalendarPlus, FaListAlt, FaCalendarCheck } from "react-icons/fa";
import Navbar from "../components/Navbar";

const navItems = [
  {
    to: "/employee-dashboard",
    end: true,
    icon: <FaListAlt />,
    label: "My Leaves",
  },
  {
    to: "/employee-dashboard/apply",
    icon: <FaCalendarPlus />,
    label: "Apply for Leave",
  },
];

const EmployeeDashboard = () => {
  return (
    <div className="flex">
      {/* ── Sidebar ── */}
      <div className="bg-[#12253d] text-white h-screen fixed left-0 top-0 bottom-0 w-64 flex flex-col">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            {/* Castle icon */}
            <div className="bg-[#1B3668] rounded-lg p-2">
              <svg viewBox="0 0 30 30" fill="white" className="w-5 h-5">
                <rect x="2" y="2" width="4" height="6" />
                <rect x="8" y="2" width="4" height="6" />
                <rect x="14" y="2" width="4" height="6" />
                <rect x="20" y="2" width="4" height="6" />
                <rect x="26" y="2" width="4" height="6" />
                <rect x="2" y="8" width="28" height="14" />
                <rect x="10" y="16" width="8" height="6" fill="#12253d" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">
                HR Leave System
              </h3>
              <p className="text-xs text-blue-300">Employee Portal</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, end, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium
                 transition-colors ${
                   isActive
                     ? "bg-[#1B3668] text-white"
                     : "text-blue-200 hover:bg-white/10 hover:text-white"
                 }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-blue-400">University of Nottingham</p>
          <p className="text-xs text-blue-500">UK | China | Malaysia</p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
