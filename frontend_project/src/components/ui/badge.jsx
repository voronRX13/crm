import React from "react";

const Badge = ({ children, color = "gray" }) => (
  <span
    className={`inline-block px-2 py-0.5 text-xs rounded-full bg-${color}-200 text-${color}-800`}
  >
    {children}
  </span>
);

export default Badge;