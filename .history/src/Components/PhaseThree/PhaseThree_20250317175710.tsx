import React from "react";
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

const PhaseThree: React.FC = () => {
  const {
    filters,
    products,
    handlePriceRangeChange,
    handleCategoryChange,
    handleRatingChange,
    handleProximityChange,
    handleSortChange,
  } = useProducts();

  const defaultCenter: LatLngExpression = [37.7749, -122.4194];

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Filter Panel */}
        <div className="lg:col-span-1 space-y-6">
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
                Store Proximity (km)
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={filters.storeProximity}
                  onChange={(e) =>
                    handleProximityChange(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-button"
                />
                <div className="text-sm text-text text-center">
                  Within {filters.storeProximity} km
                </div>
              </div>
            </div>

            {/* Sort By Filter */}
            <div className="space-y-4">
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
        </div>

        {/* Right Side - Product Table and Map */}
        <div className="lg:col-span-3 space-y-6">
          {/* Product Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="p-4 text-left text-heading font-semibold">
                      Title
                    </th>
                    <th className="p-4 text-left text-heading font-semibold">
                      Category
                    </th>
                    <th className="p-4 text-left text-heading font-semibold">
                      Image
                    </th>
                    <th className="p-4 text-left text-heading font-semibold">
                      Price
                    </th>
                    <th className="p-4 text-left text-heading font-semibold">
                      Store Name
                    </th>
                    <th className="p-4 text-left text-heading font-semibold">
                      Location
                    </th>
                    <th className="p-4 text-left text-heading font-semibold">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t hover:bg-background/50 transition-colors">
                      <td className="p-4 text-text">{product.title}</td>
                      <td className="p-4 text-text">{product.category}</td>
                      <td className="p-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                      </td>
                      <td className="p-4 font-semibold text-heading">
                        ${product.price}
                      </td>
                      <td className="p-4 text-text">{product.storeName}</td>
                      <td className="p-4 text-text">{product.location}</td>
                      <td className="p-4">
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
                        <p className="text-text mb-2">{product.location}</p>
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

          {/* Pagination */}
          <div className="flex justify-center space-x-2">
            <button className="px-4 py-2 text-text bg-background rounded-lg hover:bg-background/80 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 text-white bg-button rounded-lg hover:bg-button/90 transition-colors">
              1
            </button>
            <button className="px-4 py-2 text-text bg-background rounded-lg hover:bg-background/80 transition-colors">
              2
            </button>
            <button className="px-4 py-2 text-text bg-background rounded-lg hover:bg-background/80 transition-colors">
              3
            </button>
            <button className="px-4 py-2 text-text bg-background rounded-lg hover:bg-background/80 transition-colors">
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
