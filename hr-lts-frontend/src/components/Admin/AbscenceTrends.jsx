import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  sick: "#ef4444",
  casual: "#f59e0b",
  annual: "#3b82f6",
  unpaid: "#8b5cf6",
  maternity: "#ec4899",
  paternity: "#06b6d4",
};

const AbsenceTrends = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/leaves/reports/trends")
      .then((r) => {
        if (r.data.success) {
          setData(r.data.monthly);
          setSummary(r.data.summary);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="p-6 text-gray-500">Loading absence trends…</p>;

  const leaveTypes = [
    "sick",
    "casual",
    "annual",
    "unpaid",
    "maternity",
    "paternity",
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#1B3668]">
          Absence Trend Report
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          Monthly breakdown of approved leave by type for the current year.
        </p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(summary).map(([type, days]) => (
            <div
              key={type}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3"
            >
              <div
                className="w-3 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[type] || "#6b7280" }}
              />
              <div>
                <p className="text-xs text-gray-500 capitalize font-medium">
                  {type}
                </p>
                <p className="text-2xl font-bold text-[#1B3668]">{days}</p>
                <p className="text-xs text-gray-400">days this year</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bar chart */}
      {data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
          <p className="text-gray-400">No approved leave data available yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Monthly Leave Days by Type
          </h4>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {leaveTypes.map((type) => (
                <Bar
                  key={type}
                  dataKey={type}
                  stackId="a"
                  fill={COLORS[type]}
                  name={type}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AbsenceTrends;
