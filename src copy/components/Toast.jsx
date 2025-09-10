// Toast.jsx
import React from "react";

export default function Toast({ show, message, type = "success" }) {
  if (!show) return null;
  const bg = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`fixed top-5 right-5 z-50 transform transition-all duration-500 ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}>
      <div className={`text-white px-4 py-3 rounded-md shadow-lg ${bg}`}>
        {message}
      </div>
    </div>
  );
}
