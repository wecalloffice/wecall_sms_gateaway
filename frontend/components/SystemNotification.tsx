"use client";
import React from "react";

const SystemNotifications = () => {
  const notifications = [
    "New reseller registered",
    "SMS balance low",
    "Gateway maintenance scheduled"
  ];

  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <h2 className="font-bold mb-2">System Notifications</h2>
      <ul className="list-disc pl-5">
        {notifications.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  );
};

export default SystemNotifications;
