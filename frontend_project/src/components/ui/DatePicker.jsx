import React from "react";

const DatePicker = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-300 rounded px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default DatePicker;