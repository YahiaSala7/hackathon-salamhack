import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

// Types for our data
export interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  image: string;
}

export interface BudgetItem {
  name: string;
  value: number;
}

export interface PhaseTwoData {
  budgetData: BudgetItem[];
  recommendationsByCategory: Record<string, RecommendationItem[]>;
}

// Placeholder data
export const placeholderData: PhaseTwoData = {
  budgetData: [
    { name: "Living Room", value: 30 },
    { name: "Kitchen", value: 20 },
    { name: "Bedrooms", value: 20 },
    { name: "Bathrooms", value: 15 },
    { name: "Other Rooms", value: 15 },
  ],
  recommendationsByCategory: {
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
      // ... other Living Room items
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
      // ... other Kitchen items
    ],
    // ... other categories
  },
};

const TOAST_ID = "phase-two-data-warning";

interface UsePhaseTwoReturn {
  data: PhaseTwoData;
  isLoading: boolean;
  error: Error | null;
  isPreviewMode: boolean;
}

export const usePhaseTwo = (): UsePhaseTwoReturn => {
  const router = useRouter();

  // Check if phase one is completed (you'll need to implement this based on your app's state management)
  const isPhaseOneCompleted = false; // Replace with actual check

  const query = useQuery({
    queryKey: ["phaseTwo"],
    queryFn: async (): Promise<PhaseTwoData> => {
      const response = await fetch("/api/phase-two");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    },
    enabled: isPhaseOneCompleted,
  });

  // Show warning toast if phase one is not completed
  useEffect(() => {
    if (!isPhaseOneCompleted) {
      const showWarningToast = () => {
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
                      This is fake data for preview. Take a look, but you need
                      to fill in your data to get started.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push("/planning"); // Replace with your phase one route
                  }}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Complete Phase 1
                </button>
              </div>
            </div>
          ),
          {
            id: TOAST_ID,
            duration: Infinity,
          }
        );
      };

      showWarningToast();

      // Show toast when scrolling
      const handleScroll = () => {
        if (!toast.isActive(TOAST_ID)) {
          showWarningToast();
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        toast.dismiss(TOAST_ID);
      };
    }
  }, [isPhaseOneCompleted, router]);

  return {
    data: isPhaseOneCompleted && query.data ? query.data : placeholderData,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error : null,
    isPreviewMode: !isPhaseOneCompleted,
  };
};
