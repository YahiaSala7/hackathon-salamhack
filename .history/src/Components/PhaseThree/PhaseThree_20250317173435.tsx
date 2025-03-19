import React, { useState, useCallback } from "react";
import { Rating } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Slider } from "@mui/material";
import { LatLngExpression } from "leaflet";

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
  // State management
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: [],
    rating: 0,
    storeProximity: 10,
    sortBy: "price",
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      title: "Wooden Chair",
      category: "Living Room",
      image: "/placeholder.jpg",
      price: 50,
      storeName: "Store Name",
      location: "Location",
      rating: 4.5,
      coordinates: [37.7749, -122.4194],
    },
    // Add more sample products as needed
  ]);

  // Filter handlers
  const handlePriceRangeChange = useCallback(
    (event: any, newValue: number | number[]) => {
      setFilters((prev) => ({
        ...prev,
        priceRange: newValue as [number, number],
      }));
    },
    []
  );

  const handleCategoryChange = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const handleRatingChange = useCallback(
    (event: any, newValue: number | null) => {
      setFilters((prev) => ({ ...prev, rating: newValue || 0 }));
    },
    []
  );

  const handleProximityChange = useCallback(
    (event: any, newValue: number | number[]) => {
      setFilters((prev) => ({ ...prev, storeProximity: newValue as number }));
    },
    []
  );

  const handleSortChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  }, []);

  const defaultCenter: LatLngExpression = [37.7749, -122.4194];

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Filter Panel */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-lg shadow-sm">
          {/* Price Range Filter */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-heading">
              Price Range (USD)
            </h3>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
            <div className="flex justify-between text-sm text-text">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-heading">Category</h3>
            {["Living Room", "Kitchen", "Bedroom", "Bathroom"].map(
              (category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="form-checkbox text-button"
                  />
                  <span className="text-text">{category}</span>
                </label>
              )
            )}
          </div>

          {/* Store Proximity Filter */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-heading">
              Store Proximity (km)
            </h3>
            <Slider
              value={filters.storeProximity}
              onChange={handleProximityChange}
              valueLabelDisplay="auto"
              min={0}
              max={50}
            />
          </div>

          {/* Sort By Filter */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-heading">Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full p-2 border rounded-md">
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>

        {/* Right Side - Product Table and Map */}
        <div className="lg:col-span-3 space-y-6">
          {/* Product Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="p-4 text-left text-heading">Title</th>
                  <th className="p-4 text-left text-heading">Category</th>
                  <th className="p-4 text-left text-heading">Image</th>
                  <th className="p-4 text-left text-heading">Price</th>
                  <th className="p-4 text-left text-heading">Store Name</th>
                  <th className="p-4 text-left text-heading">Location</th>
                  <th className="p-4 text-left text-heading">Rating</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-4 text-text">{product.title}</td>
                    <td className="p-4 text-text">{product.category}</td>
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-4 text-text">${product.price}</td>
                    <td className="p-4 text-text">{product.storeName}</td>
                    <td className="p-4 text-text">{product.location}</td>
                    <td className="p-4">
                      <Rating value={product.rating} readOnly size="small" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 h-[400px]">
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
                    <div>
                      <h3 className="font-semibold">{product.storeName}</h3>
                      <p>{product.location}</p>
                      <p>Products available: {product.title}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Pagination */}
          <div className="flex justify-center space-x-2">
            <button className="px-4 py-2 text-text bg-background rounded-md hover:bg-background/80">
              Previous
            </button>
            <button className="px-4 py-2 text-white bg-button rounded-md hover:bg-button/90">
              1
            </button>
            <button className="px-4 py-2 text-text bg-background rounded-md hover:bg-background/80">
              2
            </button>
            <button className="px-4 py-2 text-text bg-background rounded-md hover:bg-background/80">
              3
            </button>
            <button className="px-4 py-2 text-text bg-background rounded-md hover:bg-background/80">
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
