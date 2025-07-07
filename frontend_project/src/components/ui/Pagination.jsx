import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center gap-2 py-2 border-t border-gray-200 bg-white">
    <button
      className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 transition"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    >
      Назад
    </button>
    <span className="text-sm text-gray-700">
      {currentPage} / {totalPages}
    </span>
    <button
      className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 transition"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    >
      Вперёд
    </button>
  </div>
);

export default Pagination;