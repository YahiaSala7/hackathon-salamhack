"use client";

import { FC, useEffect, useMemo, useCallback, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Slider from "react-slick";
import { Rating } from "@mui/material";
import { toast } from "react-hot-toast";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRecommendations } from "@/hooks/useRecommendations";
import { FormData } from "@/types/formData";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";
import { RecommendationItem } from "@/types/product";

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#5F6368"];

interface BudgetEntry {
  name: string;
  value: number;
}

interface PhaseTwoProps {
  formData: FormData | null;
  isFormSubmitted: boolean;
  hasPassedPhaseOne: boolean;
  recommendationsData: {
    budgetDistribution: BudgetEntry[];
    recommendations: Record<string, RecommendationItem[]>;
  };
  isLoading: boolean;
  error: Error | null;
}

const PhaseTwo: FC<PhaseTwoProps> = ({
  formData,
  isFormSubmitted,
  hasPassedPhaseOne,
  recommendationsData,
  isLoading,
  error,
}) => {
  const toastIdRef = useRef<string | undefined>(undefined);
  const mountTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Add image loading state
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Memoize slider settings to prevent unnecessary re-renders
  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1536,
          settings: {
            slidesToShow: 3,
            infinite: true,
          },
        },
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 2,
            infinite: true,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            infinite: true,
          },
        },
      ],
    }),
    []
  );

  // Optimized toast handling
  const showToast = useCallback(() => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    mountTimeoutRef.current = setTimeout(() => {
      toastIdRef.current = toast(
        "This is preview data. Please enter your information to fetch real data and continue.",
        {
          duration: Infinity,
          position: "top-right",
          icon: "ℹ️",
        }
      );
    }, 100);
  }, []);

  // Handle toast visibility based on scroll position and form submission
  useEffect(() => {
    if (!isFormSubmitted && hasPassedPhaseOne) {
      showToast();
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    return () => {
      if (mountTimeoutRef.current) {
        clearTimeout(mountTimeoutRef.current);
      }
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isFormSubmitted, hasPassedPhaseOne, showToast]);

  // Memoize display data to prevent unnecessary re-renders
  const displayData = useMemo(
    () => (isFormSubmitted ? recommendationsData : fakeRecommendationsData),
    [isFormSubmitted, recommendationsData]
  );

  // Memoize budget distribution data for pie chart
  const budgetDistribution = useMemo(
    () => displayData?.budgetDistribution || [],
    [displayData?.budgetDistribution]
  );

  // Optimized image loading handler
  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  }, []);

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
          <p className="text-xl font-semibold mb-2">
            Error loading recommendations
          </p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!displayData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-center">
          No recommendations available yet. Please submit the form first.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 m-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-left text-heading">
        {isFormSubmitted
          ? "Your Smart Recommendations"
          : "Preview: Smart Recommendations"}
      </h1>

      {/* Pie Chart Section */}
      <div className="mb-12 sm:mb-16">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 sm:mb-8 text-center text-heading">
          Budget Distribution Across Rooms
        </h2>
        <div className="flex flex-col mx-auto">
          <div className="lg:h-[450px] sm:h-[350px] h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius="45%"
                  outerRadius="70%"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}>
                  {budgetDistribution.map(
                    (entry: BudgetEntry, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 mt-6 sm:mt-8 px-4">
            {budgetDistribution.map((entry: BudgetEntry, index: number) => (
              <div
                key={`legend-${index}`}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-background rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm md:text-base text-text">
                <div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Sections */}
      <div className="space-y-12 sm:space-y-16">
        {Object.entries(displayData.recommendations).map(
          ([category, items]) => (
            <div key={category} className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-heading">
                {category}
              </h2>
              <div className="mx-2 sm:mx-5 md:mx-10 relative">
                <Slider {...sliderSettings}>
                  {items.map((item: RecommendationItem) => (
                    <div key={item.id} className="p-2 sm:p-4 h-full">
                      <div className="h-full bg-background rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
                        <div className="relative pt-[75%] md:pt-[66.67%] overflow-hidden">
                          {/* Blur placeholder */}
                          <div
                            className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300 ${
                              loadedImages.has(item.image)
                                ? "opacity-0"
                                : "opacity-100"
                            }`}
                          />
                          {/* Optimized image */}
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`object-cover transition-opacity duration-300 ${
                              loadedImages.has(item.image)
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                            onLoad={() => handleImageLoad(item.image)}
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
                            <span className="text-xs sm:text-sm text-text">
                              {item.category}
                            </span>
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
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )
        )}
      </div>

      <style jsx global>{`
        .slick-prev,
        .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
          transition: all 0.3s ease;
        }
        .slick-prev {
          left: -40px;
        }
        .slick-next {
          right: -40px;
        }
        .slick-prev:before,
        .slick-next:before {
          font-size: 40px;
          color: #3878ff;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }
        .slick-prev:hover:before,
        .slick-next:hover:before {
          opacity: 1;
        }
        .slick-dots {
          bottom: -30px;
        }
        .slick-dots li button:before {
          font-size: 12px;
          color: #3878ff;
          opacity: 0.4;
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
        }
        .slick-slide {
          height: inherit !important;
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
        .slick-slide > div {
          height: 100%;
        }
        @media (max-width: 768px) {
          .slick-prev {
            left: -25px;
          }
          .slick-next {
            right: -25px;
          }
          .slick-prev:before,
          .slick-next:before {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default PhaseTwo;
