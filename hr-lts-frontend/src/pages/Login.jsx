import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import API_BASE from "../utils/api";
import uonLogo from "../assets/images.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate(
          response.data.user.role === "admin"
            ? "/admin-dashboard"
            : "/employee-dashboard",
        );
      } else {
        setError(
          response.data.error || "Invalid credentials. Please try again.",
        );
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden md:flex md:w-5/12 bg-[#1B3668] flex-col justify-between p-12 text-white">
        <div>
          {/* Logo + University name */}
          <div className="flex items-center gap-5 mb-8">
            <div className="bg-[#0f2040] rounded-xl p-3 shadow-lg flex items-center justify-center w-20 h-20">
              <img
                src={uonLogo}
                alt="University of Nottingham"
                className="w-14 h-14 object-contain"
              />
            </div>
            <div>
              <p className="text-2xl font-bold leading-tight">
                University of
                <br />
                Nottingham
              </p>
              <p className="text-xs text-blue-300 tracking-[0.2em] mt-1">
                UK | CHINA | MALAYSIA
              </p>
            </div>
          </div>

          <div className="border-t border-blue-500/40 my-8" />

          <h2 className="text-3xl font-bold leading-snug mb-3">
            HR Leave &amp;
            <br />
            Absence Tracking
          </h2>
          <p className="text-blue-300 text-sm leading-relaxed">
            Manage employee leave requests, track balances, and maintain absence
            records — all in one place.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-2">
          {[
            "Annual, sick &amp; casual leave management",
            "Real-time balance tracking",
            "Admin approval workflow",
          ].map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 text-sm text-blue-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: f }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full md:w-7/12 flex flex-col justify-center items-center bg-gray-50 px-8 py-12">
        {/* Mobile header */}
        <div className="md:hidden mb-8 text-center flex flex-col items-center gap-3">
          <img
            src={uonLogo}
            alt="University of Nottingham"
            className="w-16 h-16 object-contain"
          />
          <div>
            <p className="text-xl font-bold text-[#1B3668]">
              University of Nottingham
            </p>
            <p className="text-sm text-gray-500">HR Leave Tracking System</p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#1B3668]">
                Sign in to your account
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Use your university HR credentials
              </p>
            </div>

            {error && (
              <div
                className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200
                              text-red-700 rounded-lg px-4 py-3 text-sm"
              >
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012
                       0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@nottingham.ac.uk"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                             focus:border-[#1B3668] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#1B3668]/40
                             focus:border-[#1B3668] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3668] hover:bg-[#0f2040] text-white font-semibold
                           py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60
                           disabled:cursor-not-allowed text-sm mt-2 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            University of Nottingham — HR Systems · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
