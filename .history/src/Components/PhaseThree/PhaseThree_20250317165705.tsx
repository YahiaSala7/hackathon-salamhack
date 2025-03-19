import React, { useState, useCallback } from "react";
import { Rating, Slider } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
  category: string;
  storeProximity: number;
  sortBy: "price" | "rating" | "distance";
}

const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 1000],
  category: "",
  storeProximity: 10,
  sortBy: "price",
};

const categories = ["Living Room", "Kitchen", "BedRoom", "Living Room"];

function PhaseThree() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with actual data from your backend
  const [products] = useState<Product[]>([
    {
      id: "1",
      title: "Wooden Chair",
      category: "Living Room",
      image: "/path/to/image",
      price: 50,
      storeName: "Store Name",
      location: "Location",
      rating: 4.5,
      coordinates: [37.7749, -122.4194],
    },
    // Add more mock products...
  ]);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1); // Reset to first page when filters change
    },
    []
  );

  const filteredProducts = products.filter((product) => {
    const matchesPrice =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const matchesCategory =
      !filters.category || product.category === filters.category;
    // Add more filter logic as needed
    return matchesPrice && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price":
        return a.price - b.price;
      case "rating":
        return b.rating - a.rating;
      case "distance":
        // Implement distance sorting logic
        return 0;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8">Smart Shopping Guide</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-4">Price Range (USD)</h2>
            <Slider
              value={filters.priceRange}
              onChange={(_, value) => handleFilterChange("priceRange", value)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Category</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.category === category}
                    onChange={() => handleFilterChange("category", category)}
                    className="form-checkbox"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Store Proximity (km)</h2>
            <Slider
              value={filters.storeProximity}
              onChange={(_, value) =>
                handleFilterChange("storeProximity", value)
              }
              valueLabelDisplay="auto"
              min={0}
              max={50}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Sort By</h2>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full p-2 border rounded">
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
          </div>

          {/* Map Section */}
          <div className="h-[300px] mt-6">
            <MapContainer
              center={[37.7749, -122.4194]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {currentProducts.map((product) => (
                <Marker key={product.id} position={product.coordinates}>
                  <Popup>
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p>{product.storeName}</p>
                      <p>${product.price}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Products Table Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.storeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Rating
                        value={product.rating}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50">
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === page ? "bg-blue-500 text-white" : ""
                    }`}>
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhaseThree;
