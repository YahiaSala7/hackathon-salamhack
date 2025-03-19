"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import PhaseThree from "@/Components/PhaseThree/PhaseThree";
import { FormData } from "@/types/formData";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useProducts } from "@/hooks/useProducts";

function Planning() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const phaseOneRef = useRef<HTMLDivElement | null>(null);

  // Use React Query hooks
  const {
    data: recommendationsData,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
    refetch: refetchRecommendations,
  } = useRecommendations();

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();

  const handleFormSubmit = useCallback(
    async (data: FormData) => {
      try {
        setFormData(data);
        setIsFormSubmitted(true);
        setHasPassedPhaseOne(true);

        // Fetch data for both phases in parallel
        await Promise.all([refetchRecommendations(), refetchProducts()]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    },
    [refetchRecommendations, refetchProducts]
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

  return (
    <div className="container mx-auto">
      <div ref={phaseOneRef} id="phase-one">
        <PhaseOne onSubmit={handleFormSubmit} />
      </div>

      {(isRecommendationsLoading || isProductsLoading) && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {(recommendationsError || productsError) && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-2">Error loading data</p>
            <p className="text-sm">
              {recommendationsError?.message || productsError?.message}
            </p>
          </div>
        </div>
      )}

      {!isRecommendationsLoading &&
        !isProductsLoading &&
        !recommendationsError &&
        !productsError && (
          <>
            <PhaseTwo
              formData={formData}
              isFormSubmitted={isFormSubmitted}
              hasPassedPhaseOne={hasPassedPhaseOne}
              recommendationsData={recommendationsData || null}
            />
            <PhaseThree
              formData={formData}
              isFormSubmitted={isFormSubmitted}
              productsData={productsData || null}
            />
          </>
        )}
    </div>
  );
}

export default Planning;
