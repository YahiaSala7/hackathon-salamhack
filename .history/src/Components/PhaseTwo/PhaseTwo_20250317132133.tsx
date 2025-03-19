"use client";

import { FC, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Slider from "react-slick";
import { Rating } from "@mui/material";
import { toast } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRecommendations } from "@/hooks/useRecommendations";
import { FormData } from "@/types/formData";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#5F6368"];

interface PhaseTwoProps {
  formData: FormData | null;
  isFormSubmitted: boolean;
}

const PhaseTwo: FC<PhaseTwoProps> = ({ formData, isFormSubmitted }) => {
  const {
    data: recommendationsData,
    isLoading,
    error,
  } = useRecommendations(isFormSubmitted ? formData : null);

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

  // Show toast when viewing without form submission
  useEffect(() => {
    let toastId: string;
    if (!isFormSubmitted) {
      toastId = toast(
        "This is preview data. Please enter your information to fetch real data and continue.",
        {
          duration: Infinity,
          position: "top-right",
          icon: "ℹ️",
        }
      );
    }
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isFormSubmitted]);

  // Memoize display data to prevent unnecessary re-renders
  const displayData = useMemo(
    () => (isFormSubmitted ? recommendationsData : fakeRecommendationsData),
    [isFormSubmitted, recommendationsData]
  );

  // Show loading state only when fetching real data
  if (isFormSubmitted && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state only when fetching real data fails
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

  if (!displayData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-center">
          No recommendations available yet. Please submit the form first.
        </p>
      </div>
    );
  }

  // Memoize budget distribution data for pie chart
  const budgetDistribution = useMemo(
    () => displayData.budgetDistribution,
    [displayData.budgetDistribution]
  );

  return (
    <div className="px-4 py-6  m-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-left">
        {isFormSubmitted
          ? "Your Smart Recommendations"
          : "Preview: Smart Recommendations"}
      </h1>

      {/* Pie Chart Section */}
      <div className="mb-12 sm:mb-16">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 sm:mb-8 text-center">
          Budget Distribution Across Rooms
        </h2>
        <div className=" flex flex-col mx-auto">
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
                  {budgetDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: "0.75rem",
                    "@media (min-width: 640px)": {
                      fontSize: "0.875rem",
                    },
                    "@media (min-width: 768px)": {
                      fontSize: "1rem",
                    },
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 mt-6 sm:mt-8 px-4">
            {budgetDistribution.map((entry, index) => (
              <div
                key={`legend-${index}`}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm md:text-base">
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
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
                {category}
              </h2>
              <div className="mx-2 sm:mx-5 md:mx-10 relative">
                <Slider {...sliderSettings}>
                  {items.map((item) => (
                    <div key={item.id} className="p-2 sm:p-4 h-full">
                      <div className="h-full bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
                        <div className="relative pt-[75%] md:pt-[66.67%] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="p-3 sm:p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                              {item.title}
                            </h3>
                            <span className="text-xs sm:text-sm text-gray-600">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              {item.price}
                            </span>
                            <Rating value={item.rating} readOnly size="small" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mt-auto line-clamp-3">
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
          color: #4285f4;
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
          color: #4285f4;
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
