"use client";
import React from "react";

const StatsChartContainer = () => {
  const stats = [
    { title: "Total Resellers", value: 12 },
    { title: "Total Clients", value: 120 },
    { title: "SMS Sent Today", value: 3500 },
    { title: "System Balance", value: "150,000 Credits" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-4 bg-white shadow rounded">
          <h3 className="text-sm text-gray-500">{stat.title}</h3>
          <p className="text-xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsChartContainer;
