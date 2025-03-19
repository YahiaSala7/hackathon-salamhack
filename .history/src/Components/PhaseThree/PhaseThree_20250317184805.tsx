import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LatLngExpression } from "leaflet";
import { useProducts } from "@/hooks/useProducts";

// Define interfaces
interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  storeName: string;
  location: string;
  rating: number;
  coordinates: [number, number]; // [latitude, longitude]
}

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  rating: number;
  storeProximity: number;
  sortBy: string;
}

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

// Test data for demonstration
const testProducts: Product[] = [
  {
    id: "1",
    title: "Modern Sofa",
    category: "Living Room",
    image: "https://example.com/sofa.jpg",
    price: 899.99,
    storeName: "Furniture World",
    location: "https://maps.google.com/?q=37.7749,-122.4194",
    rating: 4.5,
    coordinates: [37.7749, -122.4194],
  },
  {
    id: "2",
    title: "Kitchen Table",
    category: "Kitchen",
    image: "https://example.com/table.jpg",
    price: 299.99,
    storeName: "Home Essentials",
    location: "https://maps.google.com/?q=37.7833,-122.4167",
    rating: 4.2,
    coordinates: [37.7833, -122.4167],
  },
  {
    id: "3",
    title: "Queen Bed",
    category: "Bedroom",
    image: "https://example.com/bed.jpg",
    price: 1299.99,
    storeName: "Sleep Haven",
    location: "https://maps.google.com/?q=37.7917,-122.4083",
    rating: 4.8,
    coordinates: [37.7917, -122.4083],
  },
  {
    id: "4",
    title: "Bathroom Vanity",
    category: "Bathroom",
    image: "https://example.com/vanity.jpg",
    price: 499.99,
    storeName: "Bath & Beyond",
    location: "https://maps.google.com/?q=37.8000,-122.4000",
    rating: 4.0,
    coordinates: [37.8, -122.4],
  },
  {
    id: "5",
    title: "Reclining Chair",
    category: "Living Room",
    image: "https://example.com/chair.jpg",
    price: 399.99,
    storeName: "Comfort Zone",
    location: "https://maps.google.com/?q=37.8083,-122.3917",
    rating: 4.3,
    coordinates: [37.8083, -122.3917],
  },
  {
    id: "6",
    title: "Kitchen Island",
    category: "Kitchen",
    image: "https://example.com/island.jpg",
    price: 799.99,
    storeName: "Kitchen Plus",
    location: "https://maps.google.com/?q=37.8167,-122.3833",
    rating: 4.6,
    coordinates: [37.8167, -122.3833],
  },
  {
    id: "7",
    title: "Nightstand",
    category: "Bedroom",
    image: "https://example.com/nightstand.jpg",
    price: 199.99,
    storeName: "Bedroom Basics",
    location: "https://maps.google.com/?q=37.8250,-122.3750",
    rating: 4.1,
    coordinates: [37.825, -122.375],
  },
  {
    id: "8",
    title: "Shower System",
    category: "Bathroom",
    image: "https://example.com/shower.jpg",
    price: 299.99,
    storeName: "Bath & Beyond",
    location: "https://maps.google.com/?q=37.8333,-122.3667",
    rating: 4.4,
    coordinates: [37.8333, -122.3667],
  },
  {
    id: "9",
    title: "TV Stand",
    category: "Living Room",
    image: "https://example.com/tvstand.jpg",
    price: 249.99,
    storeName: "Furniture World",
    location: "https://maps.google.com/?q=37.8417,-122.3583",
    rating: 4.0,
    coordinates: [37.8417, -122.3583],
  },
  {
    id: "10",
    title: "Dining Set",
    category: "Kitchen",
    image: "https://example.com/dining.jpg",
    price: 599.99,
    storeName: "Home Essentials",
    location: "https://maps.google.com/?q=37.8500,-122.3500",
    rating: 4.7,
    coordinates: [37.85, -122.35],
  },
];

const PhaseThree: React.FC = () => {
  const {
    filters,
    products: originalProducts,
    handlePriceRangeChange,
    handleCategoryChange,
    handleRatingChange,
    handleProximityChange,
    handleSortChange,
  } = useProducts();

  // Combine original products with test data
  const products = [...originalProducts, ...testProducts];

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Calculate current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const defaultCenter: LatLngExpression = [37.7749, -122.4194];

  // Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === i
              ? "text-white bg-button"
              : "text-text bg-background hover:bg-background/80"
          }`}>
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side - Filter Panel and Map */}
        <div className="lg:col-span-4 space-y-6">
          {/* Filter Panel */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-heading mb-6">Filters</h2>

            {/* Price Range Filter */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-heading">
                Price Range (USD)
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handlePriceRangeChange([
                      filters.priceRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-button"
                />
                <div className="flex justify-between text-sm text-text">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-heading">Category</h3>
              <div className="space-y-2">
                {["Living Room", "Kitchen", "Bedroom", "Bathroom"].map(
                  (category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-button border-gray-300 rounded focus:ring-button"
                      />
                      <span className="text-text hover:text-heading transition-colors">
                        {category}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Store Proximity Filter */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-heading">
                Store Proximity (meters)
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={100}
                  value={filters.storeProximity * 1000} // Convert km to meters
                  onChange={(e) =>
                    handleProximityChange(parseInt(e.target.value) / 1000)
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-button"
                />
                <div className="text-sm text-text text-center">
                  Within {(filters.storeProximity * 1000).toFixed(0)} meters
                </div>
              </div>
            </div>

            {/* Sort By Filter */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-heading">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button/20 transition-shadow">
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-bold text-heading mb-4">
              Store Locations
            </h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {products.map((product) => (
                  <Marker
                    key={product.id}
                    position={product.coordinates as LatLngExpression}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-heading mb-2">
                          {product.storeName}
                        </h3>
                        <a
                          href={product.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text hover:text-button transition-colors mb-2 block">
                          {product.location}
                        </a>
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={product.rating} size="small" />
                          <span className="text-sm text-text">
                            ({product.rating})
                          </span>
                        </div>
                        <p className="text-sm text-text">
                          Products: {product.title}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right Side - Product Table */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="p-2 text-left text-heading font-semibold">
                      Title
                    </th>
                    <th className="p-2 text-left text-heading font-semibold">
                      Category
                    </th>
                    <th className="p-2 text-left text-heading font-semibold">
                      Image
                    </th>
                    <th className="p-2 text-left text-heading font-semibold">
                      Price
                    </th>
                    <th className="p-2 text-left text-heading font-semibold">
                      Store Name
                    </th>
                    <th className="p-2 text-left text-heading font-semibold">
                      Location
                    </th>
                    <th className="p-2 text-left text-heading font-semibold">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t hover:bg-background/50 transition-colors">
                      <td className="p-2 text-text">{product.title}</td>
                      <td className="p-2 text-text">{product.category}</td>
                      <td className="p-2">
                        <a
                          href={product.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-button hover:text-button/80 transition-colors">
                          View Image
                        </a>
                      </td>
                      <td className="p-2 font-semibold text-heading">
                        ${product.price}
                      </td>
                      <td className="p-2 text-text">{product.storeName}</td>
                      <td className="p-2">
                        <a
                          href={product.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-button hover:text-button/80 transition-colors">
                          View Location
                        </a>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <StarRating rating={product.rating} size="small" />
                          <span className="text-sm text-text">
                            ({product.rating})
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100"
                  : "text-text bg-background hover:bg-background/80"
              }`}>
              Previous
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-gray-400 bg-gray-100"
                  : "text-text bg-background hover:bg-background/80"
              }`}>
              Next
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-marker {
          background: none;
          border: none;
        }
        .marker {
          background-color: #3878ff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default PhaseThree;
