import React from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center text-white justify-between h-14 bg-[#1B3668] px-6 shadow-md">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 30 30" fill="white" className="w-6 h-6 opacity-80">
          <rect x="2" y="2" width="4" height="6" />
          <rect x="8" y="2" width="4" height="6" />
          <rect x="14" y="2" width="4" height="6" />
          <rect x="20" y="2" width="4" height="6" />
          <rect x="26" y="2" width="4" height="6" />
          <rect x="2" y="8" width="28" height="14" />
          <rect x="10" y="16" width="8" height="6" fill="#1B3668" />
        </svg>
        <span className="font-semibold text-sm tracking-wide">
          Welcome, <span className="font-bold">{user?.name || "User"}</span>
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0f2040] hover:bg-[#081428]
                   text-white rounded-lg text-sm font-medium transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
          />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
