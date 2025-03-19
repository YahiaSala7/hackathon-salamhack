import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Product, Category } from "@/types/product";
import { StarRating } from "./StarRating";

interface MapComponentProps {
  filteredAndSortedProducts: Product[];
  defaultCenter: [number, number];
  categoryColors: Record<Category, string>;
}

const MapComponent: React.FC<MapComponentProps> = ({
  filteredAndSortedProducts,
  defaultCenter,
  categoryColors,
}) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-[250px] sm:h-[350px] lg:h-[610px]">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredAndSortedProducts.map((product) => (
          <Marker
            key={product.id}
            position={product.coordinates}
            icon={createCategoryIcon(product.category)}>
            <Popup>
              <div className="p-1 sm:p-2 max-w-[200px] sm:max-w-[250px]">
                <div className="flex items-start justify-between mb-1 sm:mb-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-heading truncate">
                    {product.store.name}
                  </h3>
                  <span className="text-xs sm:text-sm font-semibold text-heading ml-2">
                    ${product.price}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-text mb-1 sm:mb-2 truncate">
                  {product.title}
                </p>
                <p className="text-xs sm:text-sm text-text mb-1 sm:mb-2 truncate">
                  {product.store.location.address}
                </p>
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <StarRating rating={product.rating} size="small" />
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                    style={{
                      backgroundColor: categoryColors[product.category],
                    }}
                  />
                  <span className="text-xs sm:text-sm text-text truncate">
                    {product.category}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
