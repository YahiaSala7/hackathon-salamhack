"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";
import PhaseThree from "@/Components/PhaseThree/PhaseThree";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useProducts } from "@/hooks/useProducts";

function Planning() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);
  const [hasPassedPhaseTwo, setHasPassedPhaseTwo] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const phaseOneRef = useRef<HTMLDivElement | null>(null);

  // Fetch data for all phases
  const {
    data: recommendationsData,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
  } = useRecommendations();

  const {
    products: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts();

  const handleFormSubmit = useCallback((data: FormData) => {
    setFormData(data);
    setIsFormSubmitted(true);
    setHasPassedPhaseOne(true);
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
      <PhaseTwo
        formData={formData}
        isFormSubmitted={isFormSubmitted}
        hasPassedPhaseOne={hasPassedPhaseOne}
        recommendationsData={recommendationsData}
        isLoading={isRecommendationsLoading}
        error={recommendationsError}
      />
      <PhaseThree
        formData={formData}
        isFormSubmitted={isFormSubmitted}
        hasPassedPhaseTwo={hasPassedPhaseTwo}
        productsData={productsData}
        isLoading={isProductsLoading}
        error={productsError}
      />
    </div>
  );
}

export default Planning;
