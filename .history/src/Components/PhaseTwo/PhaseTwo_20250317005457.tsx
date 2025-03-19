"use client";

import { FC, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Slider from "react-slick";
import { Rating } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getRecommendations } from "@/services/recommendations";
import { RecommendationsResponse } from "@/types/recommendations";

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#5F6368"];

const PhaseTwo: FC = () => {
  const { data: recommendationsData } = useQuery<RecommendationsResponse>({
    queryKey: ["recommendations"],
    queryFn: () => getRecommendations(),
  });

  const sliderSettings = {
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
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (recommendationsData?.isPreview) {
      const toastId = toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Preview Mode
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    This is fake data for preview. Take a look, but you need to
                    fill in your data to get started.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none">
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "top-right",
        }
      );

      const handleScroll = () => {
        if (window.scrollY > 200) {
          toast.dismiss(toastId);
          setTimeout(() => {
            if (recommendationsData?.isPreview) {
              toast.custom(
                (t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-4">
                      <div className="flex items-start">
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Preview Mode
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            This is fake data for preview. Take a look, but you
                            need to fill in your data to get started.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none">
                        Close
                      </button>
                    </div>
                  </div>
                ),
                {
                  duration: Infinity,
                  position: "top-right",
                }
              );
            }
          }, 1000);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        toast.dismiss(toastId);
      };
    }
  }, [recommendationsData?.isPreview]);

  if (!recommendationsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { budgetDistribution, recommendations } = recommendationsData.data;

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-left">
        Smart Recommendations
      </h1>

      {/* Pie Chart Section */}
      <div className="mb-16">
        <h2 className="text-xl md:text-2xl font-semibold mb-8 text-center">
          Budget Distribution Across Rooms
        </h2>
        <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] max-w-[800px] mx-auto">
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
                }>
                {budgetDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 mt-8 px-4">
            {budgetDistribution.map((entry, index) => (
              <div
                key={`legend-${index}`}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-sm md:text-base">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Sections */}
      <div className="space-y-16">
        {Object.entries(recommendations).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6">{category}</h2>
            <div className="mx-5 md:mx-10 relative">
              <Slider {...sliderSettings}>
                {items.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="h-full bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
                      <div className="relative pt-[75%] md:pt-[66.67%] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            {item.price}
                          </span>
                          <Rating value={item.rating} readOnly size="small" />
                        </div>
                        <p className="text-sm text-gray-600 mt-auto">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ))}
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
