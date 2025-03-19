import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LatLngExpression } from "leaflet";
import { useProducts } from "@/hooks/useProducts";
import { FormData } from "@/types/formData";
import { Product, Category, FilterState } from "@/types/product";
import { toast } from "react-hot-toast";
import { SAMPLE_PRODUCTS } from "@/hooks/useProducts";
import { StarRating } from "./StarRating";

// Dynamically import the map component with SSR disabled
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

// Fix marker icon issue
const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Category color mapping with new colors
const categoryColors: Record<Category, string> = {
  "Living Room": "#4285F4", // Blue
  Kitchen: "#34A853", // Green
  Bedroom: "#FBBC05", // Yellow
  Bathroom: "#EA4335", // Red
  "Other Rooms": "#5F6368", // Gray
};

// Create custom marker icons with new design
const createCategoryIcon = (category: Category) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-container">
        <div class="marker-head" style="background-color: ${categoryColors[category]}"></div>
        <div class="marker-leg" style="border-top-color: ${categoryColors[category]}"></div>
      </div>
    `,
    iconSize: [20, 28],
    iconAnchor: [10, 28],
    popupAnchor: [0, -28],
  });
};

interface PhaseThreeProps {
  formData: FormData | null;
  isFormSubmitted: boolean;
  hasPassedPhaseTwo: boolean;
  productsData: Product[];
  isLoading: boolean;
  error: Error | null;
}

const PhaseThree: React.FC<PhaseThreeProps> = ({
  formData,
  isFormSubmitted,
  hasPassedPhaseTwo,
  productsData,
  isLoading,
  error,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: [] as Category[],
    rating: 0,
    storeProximity: 5,
    sortBy: "price",
  });

  // Add view toggle state
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [isMobile, setIsMobile] = useState(false);

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      // If switching to mobile, force card view
      if (window.innerWidth < 1024 && viewMode === "table") {
        setViewMode("card");
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

  const itemsPerPage = 10;
  const defaultCenter = [37.7749, -122.4194] as [number, number];

  // Use sample data when no data is available
  const products = productsData || SAMPLE_PRODUCTS;

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...products];

    // Apply price filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      result = result.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Apply proximity filter
    if (filters.storeProximity > 0) {
      result = result.filter((product) => {
        const [lat1, lon1] = product.coordinates;
        const [lat2, lon2] = defaultCenter;
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance <= filters.storeProximity;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "distance":
          const [lat1, lon1] = defaultCenter;
          const distA = Math.sqrt(
            Math.pow(a.coordinates[0] - lat1, 2) +
              Math.pow(a.coordinates[1] - lon1, 2)
          );
          const distB = Math.sqrt(
            Math.pow(b.coordinates[0] - lat1, 2) +
              Math.pow(b.coordinates[1] - lon1, 2)
          );
          return distA - distB;
        default:
          return 0;
      }
    });

    return result;
  }, [filters, products, defaultCenter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
          onClick={() => handlePageChange(i)}
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
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Loading state
  if (isFormSubmitted && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (isFormSubmitted && error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error loading products</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // No data state - only show when there are no products at all
  if (!productsData.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-center">
          No products available yet. Please submit the form first.
        </p>
      </div>
    );
  }

  // Show filtered results message when filters are active
  const showFilteredResultsMessage =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000 ||
    filters.categories.length > 0 ||
    filters.storeProximity > 0;

  // Card View Component
  const CardView: React.FC<{ items: Product[] }> = ({ items }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg text-heading mb-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[item.category] }}
                />
                <span className="text-sm text-gray-600">{item.category}</span>
              </div>
            </div>
            <span className="text-lg font-bold text-heading">
              ${item.price}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.store.name}</span>
              <a href="#" className="text-sm text-blue-300 hover:text-blue-400">
                {item.store.location.city}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <StarRating rating={item.rating} size="small" />
            </div>

            <a
              href={item.image.url}
              className="text-sm text-blue-300 hover:text-blue-400 block">
              View Image
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      {/* Header with Title and View Toggle */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-heading">
          Smart Shopping Guide
        </h1>

        {/* View Toggle (Only visible on large screens) */}
        <div className="hidden lg:block">
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium ${
                viewMode === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}>
              Table View
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium border-l ${
                viewMode === "card"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}>
              Card View
            </button>
          </div>
        </div>
      </div>

      {showFilteredResultsMessage && filteredAndSortedProducts.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No products match your current filters. Try adjusting your
                filter settings to see more results.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Filter Panel and Map */}
        <div className="lg:col-span-1 flex flex-col space-y-1">
          {/* Filter Panel */}
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
                      priceRange: [
                        prev.priceRange[0],
                        parseInt(e.target.value),
                      ],
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
                  {(Object.keys(categoryColors) as Category[]).map(
                    (category) => (
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
                    )
                  )}
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

          {/* Map Section */}
          <MapComponent
            filteredAndSortedProducts={filteredAndSortedProducts}
            defaultCenter={defaultCenter}
            categoryColors={categoryColors}
          />
        </div>

        {/* Right Side - Product Display */}
        <div className="lg:col-span-3">
          {/* Table View */}
          {viewMode === "table" && !isMobile && (
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
                    {currentItems.map((item) => (
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
                    {currentItems.length < itemsPerPage && (
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
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredAndSortedProducts.length)} of{" "}
                    {filteredAndSortedProducts.length} entries
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300">
                      ‹
                    </button>
                    {renderPaginationButtons()}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300">
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card View */}
          {(viewMode === "card" || isMobile) && (
            <div>
              <CardView items={currentItems} />

              {/* Card View Pagination */}
              <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredAndSortedProducts.length)} of{" "}
                    {filteredAndSortedProducts.length} entries
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300">
                      ‹
                    </button>
                    {renderPaginationButtons()}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300">
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-marker {
          background: none;
          border: none;
        }
        .marker-container {
          width: 20px;
          height: 28px;
          position: relative;
        }
        .marker-head {
          width: 16px;
          height: 16px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          position: absolute;
          top: 0;
          left: 2px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .marker-leg {
          width: 2px;
          height: 12px;
          position: absolute;
          bottom: 0;
          left: 9px;
          background: linear-gradient(to bottom, currentColor, transparent);
          transform-origin: top;
        }

        /* Custom popup styles */
        .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-tip {
          background: white;
        }

        @media (min-width: 1024px) {
          .marker-container {
            width: 30px;
            height: 42px;
          }
          .marker-head {
            width: 24px;
            height: 24px;
            left: 3px;
          }
          .marker-leg {
            height: 16px;
            left: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default PhaseThree;
