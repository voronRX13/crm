import React from "react";
import { createPortal } from "react-dom";

const FilterMenuPortal = ({ children, position, onClose }) => {
  if (!position) return null;

  const style = {
    position: "absolute",
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 1000,
  };

  return createPortal(
    <div style={style} className="bg-white shadow-lg border rounded p-3 space-y-2 w-64">
      {children}
    </div>,
    document.body
  );
};

export default FilterMenuPortal;