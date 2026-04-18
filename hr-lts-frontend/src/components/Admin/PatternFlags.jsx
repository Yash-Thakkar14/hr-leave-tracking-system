import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE from "../../utils/api";

const flagColors = {
  "Monday/Friday Pattern": "bg-red-100 text-red-700 border border-red-200",
  "Frequent Short Absences":
    "bg-orange-100 text-orange-700 border border-orange-200",
  "High Sick Leave Usage":
    "bg-yellow-100 text-yellow-800 border border-yellow-200",
};

const PatternFlags = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/leaves/reports/patterns`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((r) => {
        if (r.data.success) setData(r.data.flags);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="p-6 text-gray-500">Analysing absence patterns…</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#1B3668]">
          Absence Pattern Flagging
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          Employees flagged for irregular or concerning absence patterns that
          may require HR attention.
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {Object.entries(flagColors).map(([flag, color]) => (
          <span
            key={flag}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
          >
            {flag}
          </span>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">
            No absence patterns flagged
          </p>
          <p className="text-gray-400 text-sm mt-1">
            All employees have healthy absence records.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((emp) => (
            <div
              key={emp.employeeId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-[#1B3668] flex items-center justify-center
                                  text-white font-bold text-base flex-shrink-0"
                  >
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1B3668]">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.department}</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/admin-dashboard/employees/${emp.employeeId}/leaves`,
                    )
                  }
                  className="px-3 py-1.5 bg-[#1B3668] hover:bg-[#0f2040] text-white text-xs
                             font-medium rounded-lg transition-colors flex-shrink-0"
                >
                  View Leaves
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mt-4 text-sm text-gray-600">
                <span>
                  <strong>{emp.totalAbsences}</strong> absence spells
                </span>
                <span>
                  <strong>{emp.totalDays}</strong> total days
                </span>
                <span>
                  <strong>{emp.sickCount}</strong> sick leaves
                </span>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {emp.flags.map((flag) => (
                  <span
                    key={flag}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${flagColors[flag] || "bg-gray-100 text-gray-700"}`}
                  >
                    ⚠ {flag}
                  </span>
                ))}
              </div>

              {/* Detail */}
              {emp.detail && (
                <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  {emp.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatternFlags;
