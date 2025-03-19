"use client";

import { FC, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Slider from "react-slick";
import { Rating } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample data for the pie chart
const budgetData = [
  { name: "Living Room", value: 30 },
  { name: "Kitchen", value: 20 },
  { name: "Bedrooms", value: 20 },
  { name: "Bathrooms", value: 15 },
  { name: "Other Rooms", value: 15 },
];

// Sample data for recommendation cards by category
const recommendationsByCategory = {
  "Living Room": [
    {
      id: 1,
      title: "Modern Sofa",
      category: "Living Room",
      price: "50$",
      rating: 4,
      description:
        "Our team was inspired by the seven skills of highly effective programmers",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      title: "Comfort Couch",
      category: "Living Room",
      price: "50$",
      rating: 4,
      description:
        "Our team was inspired by the seven skills of highly effective programmers",
      image:
        "https://images.unsplash.com/photo-1506898667547-42e22a46e125?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      title: "Luxury Sofa",
      category: "Living Room",
      price: "50$",
      rating: 4,
      description:
        "Our team was inspired by the seven skills of highly effective programmers",
      image:
        "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?ixlib=rb-4.0.3",
    },
    {
      id: 4,
      title: "Designer Couch",
      category: "Living Room",
      price: "50$",
      rating: 4,
      description:
        "Our team was inspired by the seven skills of highly effective programmers",
      image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3",
    },
  ],
  Kitchen: [
    {
      id: 5,
      title: "Modern Kitchen Cabinet",
      category: "Kitchen",
      price: "80$",
      rating: 5,
      description: "High-quality kitchen cabinet with modern design",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3",
    },
    {
      id: 6,
      title: "Kitchen Island",
      category: "Kitchen",
      price: "120$",
      rating: 4,
      description: "Spacious kitchen island with storage",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3",
    },
    {
      id: 7,
      title: "Kitchen Set",
      category: "Kitchen",
      price: "200$",
      rating: 5,
      description: "Complete kitchen set with modern appliances",
      image:
        "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?ixlib=rb-4.0.3",
    },
  ],
  Bedrooms: [
    {
      id: 8,
      title: "Queen Size Bed",
      category: "Bedrooms",
      price: "150$",
      rating: 5,
      description: "Comfortable queen size bed with storage",
      image:
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3",
    },
    {
      id: 9,
      title: "Wardrobe",
      category: "Bedrooms",
      price: "90$",
      rating: 4,
      description: "Spacious wardrobe with mirror",
      image:
        "https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixlib=rb-4.0.3",
    },
    {
      id: 10,
      title: "Bedside Table",
      category: "Bedrooms",
      price: "30$",
      rating: 4,
      description: "Elegant bedside table with drawer",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3",
    },
  ],
  Bathrooms: [
    {
      id: 11,
      title: "Bathroom Vanity",
      category: "Bathrooms",
      price: "100$",
      rating: 4,
      description: "Modern bathroom vanity with mirror",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3",
    },
    {
      id: 12,
      title: "Shower Set",
      category: "Bathrooms",
      price: "70$",
      rating: 5,
      description: "Complete shower set with rainfall head",
      image:
        "https://images.unsplash.com/photo-1584622781867-1c5fe959394b?ixlib=rb-4.0.3",
    },
    {
      id: 13,
      title: "Storage Cabinet",
      category: "Bathrooms",
      price: "45$",
      rating: 4,
      description: "Bathroom storage cabinet with shelves",
      image:
        "https://images.unsplash.com/photo-1584622781867-1c5fe959394b?ixlib=rb-4.0.3",
    },
  ],
};

// Types for the API responses
interface BudgetData {
  name: string;
  value: number;
}

interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  image: string;
}

interface RecommendationsByCategory {
  [key: string]: RecommendationItem[];
}

// API functions
const fetchBudgetData = async (): Promise<BudgetData[]> => {
  const response = await fetch("/api/budget-distribution");
  if (!response.ok) {
    throw new Error("Failed to fetch budget data");
  }
  return response.json();
};

const fetchRecommendations = async (): Promise<RecommendationsByCategory> => {
  const response = await fetch("/api/recommendations");
  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }
  return response.json();
};

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#5F6368"];

const PhaseTwo: FC = () => {
  const router = useRouter();

  // Check if form is submitted from localStorage
  const isFormSubmitted =
    typeof window !== "undefined"
      ? localStorage.getItem("isPhaseOneSubmitted") === "true"
      : false;

  // React Query hooks
  const {
    data: budgetDataFromApi,
    isError: isBudgetError,
    isLoading: isBudgetLoading,
  } = useQuery({
    queryKey: ["budgetDistribution"],
    queryFn: fetchBudgetData,
    enabled: isFormSubmitted, // Only fetch if form is submitted
  });

  const {
    data: recommendationsFromApi,
    isError: isRecommendationsError,
    isLoading: isRecommendationsLoading,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: fetchRecommendations,
    enabled: isFormSubmitted, // Only fetch if form is submitted
  });

  // Show toast if using preview data
  useEffect(() => {
    if (!isFormSubmitted) {
      const toastId = toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 fixed top-4 left-1/2 transform -translate-x-1/2 z-50`}>
            <div className="flex-1 w-0">
              <div className="flex items-center">
                <div className="flex-shrink-0 pt-0.5">
                  <svg
                    className="h-10 w-10 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Preview Data Only
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    This is preview data. Please fill out your information in
                    Phase One to get personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200 pl-4 ml-4">
              <button
                onClick={() => router.push("/planning")}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
                Go to Phase One
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "top-center",
        }
      );

      return () => toast.dismiss(toastId);
    }
  }, [isFormSubmitted, router]);

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

  // Use either API data or preview data
  const budgetData = isFormSubmitted ? budgetDataFromApi || [] : budgetData;
  const recommendationsByCategory = isFormSubmitted
    ? recommendationsFromApi || {}
    : recommendationsByCategory;

  // Loading states
  if (isFormSubmitted && (isBudgetLoading || isRecommendationsLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error states
  if (isFormSubmitted && (isBudgetError || isRecommendationsError)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-left">
        Smart Recompymendations
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
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="70%"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }>
                {budgetData.map((entry, index) => (
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
            {budgetData.map((entry, index) => (
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
        {Object.entries(recommendationsByCategory).map(([category, items]) => (
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
