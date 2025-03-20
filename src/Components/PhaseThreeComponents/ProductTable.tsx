import React from "react";
import { Product, Category } from "@/types/product";
import { StarRating } from "./StarRating";

interface ProductTableProps {
  items: Product[];
  categoryColors: Record<Category, string>;
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[calc(100vh-120px)]">
      <div className="overflow-x-auto flex-grow">
        <table className="w-full h-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-2 py-4 text-left text-xs sm:text-sm font-medium text-text w-[20%]">
                Title
              </th>
              <th className="px-2 py-4 text-left text-xs sm:text-sm font-medium text-text w-[15%]">
                Category
              </th>
              <th className="px-2 py-4 text-left text-xs sm:text-sm font-medium text-text w-[10%]">
                Image
              </th>
              <th className="px-2 py-4 text-left text-xs sm:text-sm font-medium text-text w-[10%]">
                Price
              </th>
              <th className="px-2 py-4 text-left text-xs sm:text-sm font-medium text-text w-[15%]">
                Store Name
              </th>
              <th className="px-2 py-4 text-left text-xs sm:text-sm font-medium text-text w-[15%]">
                Location
              </th>
              <th className="px-2 py-4 text-left text-xs sm:text-sm font-medium text-text w-[15%]">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-background">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 text-xs sm:text-sm text-text truncate">
                  {item.title}
                </td>
                <td className="px-2 py-4 text-xs sm:text-sm text-text">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: categoryColors[item.category],
                      }}
                    />
                    <span className="truncate">{item.category}</span>
                  </div>
                </td>
                <td className="px-2 py-4 text-xs sm:text-sm">
                  <a
                    href={item.image.url}
                    className="text-blue-300 hover:text-blue-400 truncate block">
                    View Image
                  </a>
                </td>
                <td className="px-2 py-4 text-xs sm:text-sm text-heading">
                  ${item.price}
                </td>
                <td className="px-2 py-4 text-xs sm:text-sm text-text truncate">
                  {item.store.name}
                </td>
                <td className="px-2 py-4 text-xs sm:text-sm">
                  <a
                    href="#"
                    className="text-blue-300 hover:text-blue-400 truncate block">
                    {item.store.location.city}
                  </a>
                </td>
                <td className="px-2 py-4 text-xs sm:text-sm text-text">
                  <StarRating rating={item.rating} size="small" />
                </td>
              </tr>
            ))}
            {items.length < itemsPerPage && (
              <tr>
                <td colSpan={7} className="h-[calc(100vh-24rem)]"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="px-6 py-4 bg-white border-t">
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
