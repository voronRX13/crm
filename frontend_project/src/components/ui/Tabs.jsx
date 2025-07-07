import React from "react";

const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex mb-4 border-b border-gray-300">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        className={`px-4 py-2 border-b-2 -mb-px text-sm ${
          activeTab === tab.key
            ? "border-blue-500 text-blue-500 font-bold"
            : "border-transparent text-gray-500 hover:text-blue-500"
        }`}
        onClick={() => onChange(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;