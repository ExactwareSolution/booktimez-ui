import React from "react";

export default function ServiceCard({ service, onShow }) {
  return (
    <div className="p-4 bg-white text-gray-800 rounded shadow">
      <h3 className="font-medium">{service.name}</h3>
      <p className="text-sm text-gray-500">
        Duration: {service.durationMinutes} mins
      </p>
      <button
        onClick={() => onShow(service)}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
      >
        Show slots
      </button>
    </div>
  );
}
