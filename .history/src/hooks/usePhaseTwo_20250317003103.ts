import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import {
  BudgetData,
  RecommendationsByCategory,
  PhaseTwoData,
} from "@/types/phaseTwo";

// Placeholder data
const placeholderBudgetData: BudgetData[] = [
  { name: "Living Room", value: 30 },
  { name: "Kitchen", value: 20 },
  { name: "Bedrooms", value: 20 },
  { name: "Bathrooms", value: 15 },
  { name: "Other Rooms", value: 15 },
];

const placeholderRecommendations: RecommendationsByCategory = {
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
    // ... other items
  ],
  // ... other categories
};

// API calls
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

export const usePhaseTwo = (): PhaseTwoData => {
  const router = useRouter();

  // Check if user has submitted phase one data
  const hasSubmittedPhaseOne = () => {
    try {
      const phaseOneData = localStorage.getItem("phaseOneData");
      return !!phaseOneData;
    } catch {
      return false;
    }
  };

  // Queries
  const {
    data: budgetData,
    isLoading: isBudgetLoading,
    error: budgetError,
  } = useQuery({
    queryKey: ["budgetData"],
    queryFn: fetchBudgetData,
    enabled: hasSubmittedPhaseOne(),
    placeholderData: placeholderBudgetData,
  });

  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: fetchRecommendations,
    enabled: hasSubmittedPhaseOne(),
    placeholderData: placeholderRecommendations,
  });

  // Toast notification logic
  useEffect(() => {
    let toastId: string;

    const showToast = () => {
      if (!hasSubmittedPhaseOne()) {
        toastId = toast.custom(
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
                      This is fake data for preview. Take a look, but you need
                      to fill in your data to get started.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => {
                    toast.dismiss(toastId);
                    router.push("/planning");
                  }}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none">
                  Fill Data
                </button>
              </div>
            </div>
          ),
          { duration: Infinity, position: "top-right" }
        );
      }
    };

    showToast();

    // Show toast on scroll if not submitted
    const handleScroll = () => {
      if (!hasSubmittedPhaseOne()) {
        showToast();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [router]);

  return {
    budgetData: budgetData || placeholderBudgetData,
    recommendations: recommendations || placeholderRecommendations,
    isLoading: isBudgetLoading || isRecommendationsLoading,
    error: budgetError || recommendationsError,
    isPreviewMode: !hasSubmittedPhaseOne(),
  };
};
