import React from "react";
import { Product, Category } from "@/types/product";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  item: Product;
  categoryColors: Record<Category, string>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  categoryColors,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
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
        <span className="text-lg font-bold text-heading">${item.price}</span>
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
  );
};
