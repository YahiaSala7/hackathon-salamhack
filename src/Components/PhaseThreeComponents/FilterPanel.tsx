import React from "react";
import { Category, FilterState } from "@/types/product";

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categoryColors: Record<Category, string>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  categoryColors,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-4">
        {/* Price Range Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-semibold text-heading">
              Price Range
            </h3>
            <span className="text-xs sm:text-sm text-text bg-gray-50 px-2 py-1 rounded-full">
              USD
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: [prev.priceRange[0], parseInt(e.target.value)],
              }))
            }
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs sm:text-sm text-text">
            <span className="bg-gray-50 px-2 py-1 rounded-full">
              ${filters.priceRange[0]}
            </span>
            <span className="bg-gray-50 px-2 py-1 rounded-full">
              ${filters.priceRange[1]}
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-semibold text-heading">
            Category
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(categoryColors) as Category[]).map((category) => (
              <label
                key={category}
                className="flex items-center space-x-2 cursor-pointer bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => {
                    setFilters((prev) => ({
                      ...prev,
                      categories: prev.categories.includes(category)
                        ? prev.categories.filter((c) => c !== category)
                        : [...prev.categories, category],
                    }));
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs sm:text-sm text-text hover:text-heading transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Store Proximity Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-semibold text-heading">
              Store Proximity
            </h3>
            <span className="text-xs sm:text-sm text-text bg-gray-50 px-2 py-1 rounded-full">
              km
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={filters.storeProximity}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                storeProximity: parseInt(e.target.value),
              }))
            }
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="text-xs sm:text-sm text-text text-center bg-gray-50 px-2 py-1 rounded-full">
            Within {filters.storeProximity} km
          </div>
        </div>

        {/* Sort By Filter */}
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-semibold text-heading">
            Sort By
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "price" as const, label: "Price" },
              { value: "rating" as const, label: "Rating" },
              { value: "distance" as const, label: "Distance" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: option.value,
                  }))
                }
                className={`px-2 py-1.5 text-xs sm:text-sm rounded-lg transition-all ${
                  filters.sortBy === option.value
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-50 text-text hover:bg-gray-100"
                }`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
