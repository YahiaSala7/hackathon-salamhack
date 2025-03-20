"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";
import PhaseThree from "@/Components/PhaseThree/PhaseThree";
import { useCombinedData } from "@/hooks/useCombinedData";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";
import {
  Product,
  Category,
  BudgetDistribution,
  RecommendationItem,
} from "@/types/product";
import PhaseFour from "@/Components/PhaseFour/PhaseFour";
import PhaseFive from "@/Components/PhaseFive/PhaseFive";
import { usePlanningData } from "@/hooks/usePlanningData";
import { SAMPLE_PRODUCTS } from "@/utils/fakeProductData";

import { useHomeSubmission } from "@/hooks/useHomeSubmission";
interface CombinedData {
  budgetDistribution: BudgetDistribution[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}
function Planning() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);
  const [hasPassedPhaseTwo, setHasPassedPhaseTwo] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const phaseOneRef = useRef<HTMLDivElement | null>(null);
  const data = usePlanningData();
  const budgetDistribution = data?.budgetDistribution ?? [];
  const products = data?.products ?? [];
  const recommendations = data?.recommendations ?? {};
  console.log(data);
  // Retrieve cached data from React Query
  const cachedData = usePlanningData();
  const { mutate: submitForm, isPending: isSubmitting } = useHomeSubmission();

  // Handle form submission and extract cached data
  const handleFormSubmit = useCallback(
    (data: FormData) => {
      setFormData(data);
      setIsFormSubmitted(true);
      setHasPassedPhaseOne(true);

      // Submit form data and cache response
      submitForm(data);

      // Extract cached data after submission
      if (cachedData) {
        const { budgetDistribution, products, recommendations } = cachedData;
        console.log("Cached Data:", {
          budgetDistribution,
          products,
          recommendations,
        });
      }
    },
    [submitForm, cachedData]
  );
  // Optimized scroll handler with debouncing
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (phaseOneRef.current) {
        const rect = phaseOneRef.current.getBoundingClientRect();
        const isPhaseOneVisible = rect.bottom > 0;
        setHasPassedPhaseOne(!isPhaseOneVisible);
      }
    }, 100);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);
  // console.log(combinedData);

  return (
    <div className="container mx-auto">
      <div ref={phaseOneRef} id="phase-one">
        <PhaseOne onSubmit={handleFormSubmit} />
      </div>
      <PhaseTwo
        formData={formData}
        isFormSubmitted={isFormSubmitted}
        hasPassedPhaseOne={hasPassedPhaseOne}
        recommendationsData={
          isFormSubmitted
            ? {
                budgetDistribution: cachedData?.budgetDistribution || [],
                recommendations: cachedData?.recommendations || {},
              }
            : fakeRecommendationsData
        }
        isLoading={isSubmitting}
        error={null}
      />
      <PhaseThree
        formData={formData}
        isFormSubmitted={isFormSubmitted}
        hasPassedPhaseTwo={hasPassedPhaseTwo}
        productsData={
          isFormSubmitted ? cachedData?.products || [] : SAMPLE_PRODUCTS
        }
        isLoading={isSubmitting}
        error={null}
      />
      <PhaseFour
        formData={formData || undefined}
        recommendations={
          isFormSubmitted
            ? recommendations
            : fakeRecommendationsData.recommendations
        }
      />
      <PhaseFive
        formData={formData || undefined}
        budgetDistribution={
          isFormSubmitted
            ? budgetDistribution
            : fakeRecommendationsData.budgetDistribution
        }
        recommendations={
          isFormSubmitted
            ? recommendations
            : fakeRecommendationsData.recommendations
        }
        products={isFormSubmitted ? products : SAMPLE_PRODUCTS}
      />
    </div>
  );
}

export default Planning;
// Fetch combined data for all phases
// const {
//   data: combinedData,
//   isLoading: isCombinedDataLoading,
//   error: combinedDataError,
// } = useCombinedData();
