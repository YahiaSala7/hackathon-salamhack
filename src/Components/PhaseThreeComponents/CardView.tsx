import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface CardViewProps {
  items: Product[];
  categoryColors: Record<string, string>;
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const CardView: React.FC<CardViewProps> = ({
  items,
  categoryColors,
  itemsPerPage,
  currentPage,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 3;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisibleButtons) {
      if (currentPage <= Math.floor(maxVisibleButtons / 2)) {
        endPage = maxVisibleButtons;
      } else if (
        currentPage >=
        totalPages - Math.floor(maxVisibleButtons / 2)
      ) {
        startPage = totalPages - maxVisibleButtons + 1;
      } else {
        startPage = currentPage - Math.floor(maxVisibleButtons / 2);
        endPage = currentPage + Math.floor(maxVisibleButtons / 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 ${
            currentPage === i
              ? "text-white bg-blue-500 rounded"
              : "text-gray-700 hover:bg-gray-100 rounded"
          }`}>
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      buttons.unshift(
        <span key="start-ellipsis" className="px-3 py-2">
          ...
        </span>
      );
    }
    if (endPage < totalPages) {
      buttons.push(
        <span key="end-ellipsis" className="px-3 py-2">
          ...
        </span>
      );
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            categoryColors={categoryColors}
          />
        ))}
      </div>

      {/* Card View Pagination */}
      <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} entries
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300">
              ‹
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
