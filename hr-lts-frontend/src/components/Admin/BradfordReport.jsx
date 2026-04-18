import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../../utils/api";

// Bradford Factor = S² × D
// S = number of separate absence spells, D = total days absent
// Risk bands: <51 low, 51-199 medium, 200+ high

const getBand = (score) => {
  if (score >= 200)
    return {
      label: "High Risk",
      color: "bg-red-100 text-red-700 border border-red-200",
    };
  if (score >= 51)
    return {
      label: "Medium Risk",
      color: "bg-orange-100 text-orange-700 border border-orange-200",
    };
  return {
    label: "Low Risk",
    color: "bg-green-100 text-green-700 border border-green-200",
  };
};

const BradfordReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/leaves/reports/bradford`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((r) => {
        if (r.data.success) setData(r.data.report);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="p-6 text-gray-500">Calculating Bradford scores…</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#1B3668]">
          Bradford Factor Report
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          Measures impact of short, frequent absences. Score = S² × D where S =
          separate absence spells, D = total days absent.
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          {
            label: "Low Risk",
            range: "Score < 51",
            color: "bg-green-100 text-green-700 border border-green-200",
          },
          {
            label: "Medium Risk",
            range: "Score 51–199",
            color: "bg-orange-100 text-orange-700 border border-orange-200",
          },
          {
            label: "High Risk",
            range: "Score ≥ 200",
            color: "bg-red-100 text-red-700 border border-red-200",
          },
        ].map((b) => (
          <span
            key={b.label}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${b.color}`}
          >
            {b.label} ({b.range})
          </span>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
          <p className="text-gray-400">
            No approved absence data available yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#1B3668] text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-center">Spells (S)</th>
                <th className="px-4 py-3 text-center">Total Days (D)</th>
                <th className="px-4 py-3 text-center">Score (S²×D)</th>
                <th className="px-4 py-3 text-left">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, i) => {
                const band = getBand(row.score);
                return (
                  <tr key={row.employeeId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {row.department}
                    </td>
                    <td className="px-4 py-3 text-center">{row.spells}</td>
                    <td className="px-4 py-3 text-center">{row.totalDays}</td>
                    <td className="px-4 py-3 text-center font-bold text-[#1B3668]">
                      {row.score}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${band.color}`}
                      >
                        {band.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BradfordReport;
