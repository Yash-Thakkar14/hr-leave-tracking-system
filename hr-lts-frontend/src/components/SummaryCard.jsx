import React from "react";

const SummaryCard = ({ icon, title, value, color }) => {
  return (
    <div className="rounded flex bg-white">
      <div
        className={`text-3xl flex justify-center items-center ${color} text-white px-4`}
      >
        {icon}
      </div>
      <div className="pl-4 py-1">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
