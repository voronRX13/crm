import React, { useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

const FilterMenuPortal = ({ children, position }) => {
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

const Table = ({ data, columns, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [filterPosition, setFilterPosition] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const buttonRef = useRef(null);

  const enhancedColumns = useMemo(
    () => [
      ...columns,
      {
        key: "__actions",
        label: "Действие",
        render: (_, row) => (
          <div className="flex items-center justify-center gap-2 text-sm">
            {onEdit && (
              <button
                onClick={() => onEdit(row)}
                className="text-blue-500 hover:underline"
                title="Редактировать"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(row)}
                className="text-red-500 hover:underline"
                title="Удалить"
              >
                🗑️
              </button>
            )}
          </div>
        ),
      },
    ],
    [columns, onEdit, onDelete]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.entries(filters).every(([key, value]) =>
        String(item[key] || "").toLowerCase().includes(value.toLowerCase())
      )
    );
  }, [data, filters]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleOpenFilters = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setFilterPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setOpenFilterMenu((prev) => !prev);
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="relative p-4 border-b border-gray-200">
        <button
          ref={buttonRef}
          onClick={handleOpenFilters}
          className="px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 text-sm transition"
        >
          Фильтры
        </button>
      </div>

      {openFilterMenu && (
        <FilterMenuPortal position={filterPosition}>
          {columns.map((col) => (
            <label key={col.key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={activeFilters.includes(col.key)}
                onChange={() => {
                  setActiveFilters((prev) =>
                    prev.includes(col.key)
                      ? prev.filter((k) => k !== col.key)
                      : [...prev, col.key]
                  );
                }}
              />
              <span>{col.label}</span>
            </label>
          ))}
        </FilterMenuPortal>
      )}

      <div className="flex flex-wrap gap-2 px-4 py-2">
        {columns
          .filter((col) => activeFilters.includes(col.key))
          .map((col) => (
            <div key={col.key} className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">{col.label}</label>
              <input
                type="text"
                className="border rounded px-2 py-1 text-sm"
                placeholder={`Фильтр по ${col.label}`}
                value={filters[col.key] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [col.key]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
      </div>

      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full table-fixed border-collapse">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="text-sm text-gray-800 border-b border-gray-300">
              {enhancedColumns.map((col) => (
                <th
                  key={col.key}
                  className="relative px-3 py-2 text-left border-r border-gray-300 text-sm text-gray-800 whitespace-nowrap"
                >
                  <div
                    className="flex items-center gap-1 cursor-pointer select-none"
                    onClick={() =>
                      setSortConfig((prev) => ({
                        key: col.key,
                        direction:
                          prev.key === col.key && prev.direction === "asc"
                            ? "desc"
                            : "asc",
                      }))
                    }
                  >
                    <span>{col.label}</span>
                    {sortConfig.key === col.key && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={enhancedColumns.length}
                  className="text-center text-gray-500 py-8 text-sm"
                >
                  Нет данных
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  {enhancedColumns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-2 border-r border-gray-200 text-sm text-gray-800 whitespace-nowrap break-words"
                    >
                      {col.render
                        ? col.render(row?.[col.key] ?? "", row)
                        : row?.[col.key] ?? ""}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;