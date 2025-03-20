import React, { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";
import { useProducts } from "@/hooks/useProducts";
import { FormData } from "@/types/formData";
import { Product, Category, FilterState } from "@/types/product";
import { StarRating } from "../PhaseThreeComponents/StarRating";
import { FilterPanel } from "../PhaseThreeComponents/FilterPanel";
import { MapView } from "../PhaseThreeComponents/MapView";
import { ProductTable } from "../PhaseThreeComponents/ProductTable";
import { CardView } from "../PhaseThreeComponents/CardView";

// Category color mapping with new colors
const categoryColors: Record<Category, string> = {
  "Living Room": "#4285F4", // Blue
  Kitchen: "#34A853", // Green
  Bedroom: "#FBBC05", // Yellow
  Bathroom: "#EA4335", // Red
  "Other Rooms": "#5F6368", // Gray
};

interface PhaseThreeProps {
  formData: FormData | null;
  isFormSubmitted: boolean;
  hasPassedPhaseTwo: boolean;
  productsData: Product[];
  // isLoading: boolean;
  // error: Error | null;
}

const PhaseThree: React.FC<PhaseThreeProps> = ({
  formData,
  isFormSubmitted,
  hasPassedPhaseTwo,
  productsData,
  // isLoading,
  // error,
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
  const defaultCenter: LatLngExpression = [37.7749, -122.4194];

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...productsData];

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
  }, [filters, productsData, defaultCenter]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Loading state
  if (isFormSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (isFormSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error loading products</p>
          {/* <p className="text-sm">{error.message}</p> */}
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
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            categoryColors={categoryColors}
          />

          <MapView
            products={filteredAndSortedProducts}
            defaultCenter={defaultCenter}
          />
        </div>

        {/* Right Side - Product Display */}
        <div className="lg:col-span-3">
          {viewMode === "table" && !isMobile ? (
            <ProductTable
              items={currentItems}
              categoryColors={categoryColors}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalItems={filteredAndSortedProducts.length}
              onPageChange={handlePageChange}
            />
          ) : (
            <CardView
              items={currentItems}
              categoryColors={categoryColors}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalItems={filteredAndSortedProducts.length}
              onPageChange={handlePageChange}
            />
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
