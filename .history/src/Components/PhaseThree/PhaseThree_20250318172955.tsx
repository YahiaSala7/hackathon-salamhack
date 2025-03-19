import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LatLngExpression } from "leaflet";
import { FormData } from "@/types/formData";
import { Product, Category, FilterState } from "@/types/product";
import { toast } from "react-hot-toast";
import { fakeProductsData } from "@/utils/fakeProducts";

// Star rating component
const StarRating: React.FC<{ rating: number; size?: "small" | "medium" }> = ({
  rating,
  size = "small",
}) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const filled = index < Math.floor(rating);
    const half = index === Math.floor(rating) && rating % 1 !== 0;
    const sizeClass = size === "small" ? "w-4 h-4" : "w-5 h-5";

    return (
      <span key={index} className="text-yellow-400">
        {filled ? (
          <svg className={sizeClass} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ) : half ? (
          <svg className={sizeClass} fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ) : (
          <svg className={sizeClass} fill="#E5E7EB" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </span>
    );
  });

  return <div className="flex">{stars}</div>;
};

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
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

interface PhaseThreeProps {
  formData: FormData | null;
  isFormSubmitted: boolean;
  productsData: Product[] | null;
}

const PhaseThree: React.FC<PhaseThreeProps> = ({
  formData,
  isFormSubmitted,
  productsData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: [],
    rating: 0,
    storeProximity: 10,
    sortBy: "price",
  });
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [isMobile, setIsMobile] = useState(false);
  const productsPerPage = 12;

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setViewMode("grid");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    if (!productsData) return [];

    let filtered = [...productsData];

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "proximity":
        // Implement proximity sorting logic here
        break;
      default:
        break;
    }

    return filtered;
  }, [productsData, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage
  );
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}>
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (!productsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-semibold mb-2">No products available</p>
          <p className="text-sm">Please submit the form to view products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Products</h2>
        {!isMobile && (
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}>
              Grid View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded ${
                viewMode === "map"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}>
              Map View
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                handleFilterChange({
                  priceRange: [parseInt(e.target.value), filters.priceRange[1]],
                })
              }
              className="w-24 px-2 py-1 border rounded"
              min="0"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange({
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                })
              }
              className="w-24 px-2 py-1 border rounded"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <select
            multiple
            value={filters.categories}
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value as Category
              );
              handleFilterChange({ categories: selectedOptions });
            }}
            className="w-full px-2 py-1 border rounded">
            <option value="Living Room">Living Room</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Bathroom">Bathroom</option>
            <option value="Other Rooms">Other Rooms</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Rating
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.rating}
            onChange={(e) =>
              handleFilterChange({ rating: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <div className="text-sm text-gray-600">{filters.rating} stars</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              handleFilterChange({
                sortBy: e.target.value as FilterState["sortBy"],
              })
            }
            className="w-full px-2 py-1 border rounded">
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="proximity">Proximity</option>
          </select>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={product.image.url}
                alt={product.image.alt}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <p className="text-blue-600 font-bold mb-2">${product.price}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{product.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-500">{product.location}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[600px]">
          <MapContainer
            center={[37.7749, -122.4194]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {currentProducts.map((product) => (
              <Marker
                key={product.id}
                position={product.coordinates as LatLngExpression}>
                <Popup>
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-gray-600">{product.category}</p>
                    <p className="text-blue-600 font-bold">${product.price}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{product.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{product.location}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
};

export default PhaseThree;
