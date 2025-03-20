"use client";

import { FC, useEffect, useMemo, useCallback, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecommendations } from "@/hooks/useRecommendations";
import { FormData } from "@/types/formData";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";
import { BudgetDistribution, RecommendationItem } from "@/types/product";
import { BudgetChart } from "../PhaseTwoComponents/BudgetChart";
import { RecommendationSlider } from "../PhaseTwoComponents/RecommendationSlider";
import { LoadingState } from "../PhaseTwoComponents/LoadingState";

interface PhaseTwoProps {
  formData: FormData | null;
  isFormSubmitted: boolean;
  hasPassedPhaseOne: boolean;
  recommendationsData: {
    budgetDistribution: BudgetDistribution[];
    recommendations: Record<string, RecommendationItem[]>;
  };
  // isLoading: boolean;
  // error: Error | null;
}

const PhaseTwo: FC<PhaseTwoProps> = ({
  formData,
  isFormSubmitted,
  hasPassedPhaseOne,
  recommendationsData,
  // isLoading,
  // error,
}) => {
  const toastIdRef = useRef<string | undefined>(undefined);
  const mountTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  // console.log(recommendationsData);
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
  // console.log(displayData);
  // Optimized image loading handler
  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  }, []);

  return (
    <div className="px-4 py-6 m-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-left text-heading">
        {isFormSubmitted
          ? "Your Smart Recommendations"
          : "Preview: Smart Recommendations"}
      </h1>

      {/* <LoadingState
        isLoading={isLoading}
        error={error}
        displayData={displayData}
      /> */}

      {displayData && (
        <>
          <BudgetChart budgetDistribution={displayData.budgetDistribution} />

          {/* Recommendations Sections */}
          <div className="space-y-12 sm:space-y-16">
            {Object.entries(displayData.recommendations).map(
              ([category, items]) => (
                <RecommendationSlider
                  key={category}
                  category={category}
                  items={items}
                  loadedImages={loadedImages}
                  onImageLoad={handleImageLoad}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PhaseTwo;
