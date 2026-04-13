import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
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
          onClick={() => setShowConfirm(true)}
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

      {/* ── Logout confirm modal ── */}
      {showConfirm && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center
                     justify-center z-50 px-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1B3668] px-6 py-4 flex items-center justify-between">
              <h4 className="text-white font-bold text-lg">Sign Out</h4>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-white/70 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-12 h-12 rounded-full bg-blue-50 flex items-center
                                justify-center flex-shrink-0"
                >
                  <svg
                    className="w-6 h-6 text-[#1B3668]"
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
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Are you sure you want to sign out?
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Signed in as{" "}
                    <span className="font-medium text-[#1B3668]">
                      {user?.name}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm
                             font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 bg-[#1B3668] hover:bg-[#0f2040] text-white
                             text-sm font-semibold rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
