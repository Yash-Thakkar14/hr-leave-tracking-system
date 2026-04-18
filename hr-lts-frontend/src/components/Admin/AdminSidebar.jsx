import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";

const mainNav = [
  {
    to: "/admin-dashboard",
    end: true,
    icon: <FaTachometerAlt />,
    label: "Dashboard",
  },
  {
    to: "/admin-dashboard/employees",
    end: false,
    icon: <FaUsers />,
    label: "Employees",
  },
  {
    to: "/admin-dashboard/departments",
    end: false,
    icon: <FaBuilding />,
    label: "Departments",
  },
  {
    to: "/admin-dashboard/leaves",
    end: false,
    icon: <FaCalendarAlt />,
    label: "Leaves",
  },
];

const reportNav = [
  { to: "/admin-dashboard/reports/bradford", label: "Bradford Factor" },
  { to: "/admin-dashboard/reports/trends", label: "Absence Trends" },
  { to: "/admin-dashboard/reports/patterns", label: "Pattern Flagging" },
];

const linkCls = ({ isActive }) =>
  `flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-[#1B3668] text-white"
      : "text-blue-200 hover:bg-white/10 hover:text-white"
  }`;

const AdminSidebar = () => (
  <div className="bg-[#12253d] text-white h-screen fixed left-0 top-0 bottom-0 w-64 flex flex-col">
    {/* Brand */}
    <div className="px-5 py-5 border-b border-white/10">
      <div className="flex items-center gap-3">
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
          <h3 className="font-bold text-sm leading-tight">HR Leave System</h3>
          <p className="text-xs text-blue-300">Admin Portal</p>
        </div>
      </div>
    </div>

    {/* Main nav */}
    <nav className="px-3 py-4 space-y-1">
      {mainNav.map(({ to, end, icon, label }) => (
        <NavLink key={to} to={to} end={end} className={linkCls}>
          <span className="text-base">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>

    {/* Reports section */}
    <div className="px-3 pb-4">
      <div className="border-t border-white/10 pt-4 mb-2">
        <div className="flex items-center gap-2 px-4 mb-2">
          <FaChartBar className="text-blue-400 text-xs" />
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Reports
          </p>
        </div>
        <div className="space-y-1">
          {reportNav.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkCls}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 ml-1" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="mt-auto px-5 py-4 border-t border-white/10">
      <p className="text-xs text-blue-400">University of Nottingham</p>
    </div>
  </div>
);

export default AdminSidebar;
