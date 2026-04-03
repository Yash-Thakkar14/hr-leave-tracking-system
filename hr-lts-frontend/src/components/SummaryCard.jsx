import React from "react";

const SummaryCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <div>{icon}</div>
      <div>
        <p>{title}</p>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
