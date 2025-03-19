"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";
import PhaseThree from "@/Components/PhaseThree/PhaseThree";
import { recommendationsApi } from "@/services/recommendationsApi";
import { productsApi } from "@/services/productsApi";
import { RecommendationsData } from "@/types/recommendations";
import { Product } from "@/types/product";
import { ApiResponse } from "@/services/api";

function Planning() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);
  const [recommendationsData, setRecommendationsData] =
    useState<RecommendationsData | null>(null);
  const [productsData, setProductsData] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const phaseOneRef = useRef<HTMLDivElement | null>(null);

  const handleFormSubmit = useCallback(async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data for both phases in parallel
      const [recommendationsResponse, productsResponse] = await Promise.all([
        recommendationsApi.getRecommendations(data),
        productsApi.getProducts(data),
      ]);

      if (!recommendationsResponse.data) {
        throw new Error("No recommendations data received");
      }
      if (!productsResponse.data) {
        throw new Error("No products data received");
      }

      setRecommendationsData(recommendationsResponse.data);
      setProductsData(productsResponse.data);
      setFormData(data);
      setIsFormSubmitted(true);
      setHasPassedPhaseOne(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    }, 100); // Debounce scroll events
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
      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-2">Error loading data</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      )}
      {!isLoading && !error && (
        <>
          <PhaseTwo
            formData={formData}
            isFormSubmitted={isFormSubmitted}
            hasPassedPhaseOne={hasPassedPhaseOne}
            recommendationsData={recommendationsData}
          />
          <PhaseThree
            formData={formData}
            isFormSubmitted={isFormSubmitted}
            productsData={productsData}
          />
        </>
      )}
    </div>
  );
}

export default Planning;
