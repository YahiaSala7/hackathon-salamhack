import { FC } from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import { RecommendationItem } from "@/types/product";

interface RecommendationCardProps {
  item: RecommendationItem;
  isLoaded: boolean;
  onLoad: () => void;
  isFormSubmitted: boolean;
}

export const RecommendationCard: FC<RecommendationCardProps> = ({
  item,
  isLoaded,
  onLoad,
  isFormSubmitted,
}) => {
  console.log();
  const rawUrl = `https://designture.runasp.net/${item.image}`;
  const cleanedUrl = rawUrl.replace("/wwwroot", "");
  return (
    <div className="h-full bg-background rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      <div className="relative pt-[75%] md:pt-[66.67%] overflow-hidden">
        {/* Blur placeholder */}
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* Optimized image */}
        <Image
          src={isFormSubmitted ? cleanedUrl : item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={onLoad}
          priority={false}
          loading="lazy"
          quality={75}
        />
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1.5 sm:mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-heading line-clamp-1">
            {item.title}
          </h3>
          <span className="text-xs sm:text-sm text-text">{item.category}</span>
        </div>
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <span className="text-lg sm:text-xl font-bold text-heading">
            ${item.price.toLocaleString()}
          </span>
          <Rating value={item.rating} readOnly size="small" />
        </div>
        <p className="text-xs sm:text-sm text-text mt-auto line-clamp-3">
          {item.description}
        </p>
      </div>
    </div>
  );
};
