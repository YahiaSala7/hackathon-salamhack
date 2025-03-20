"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";
import PhaseThree from "@/Components/PhaseThree/PhaseThree";
import { useHomeSubmission } from "@/hooks/useHomeSubmission";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";
import {
  Product,
  Category,
  BudgetDistribution,
  RecommendationItem,
} from "@/types/product";
import PhaseFour from "@/Components/PhaseFour/PhaseFour";
import PhaseFive from "@/Components/PhaseFive/PhaseFive";

// Sample data for preview
const SAMPLE_PRODUCTS: Product[] = Array(30)
  .fill(null)
  .map((_, index) => {
    const categories: Category[] = [
      "Living Room",
      "Kitchen",
      "Bedroom",
      "Bathroom",
      "Other Rooms",
    ];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    return {
      id: `product-${index}`,
      title: `Sample Product ${index + 1}`,
      category: randomCategory,
      image: {
        url: "https://example.com/image.jpg",
        alt: `Sample Product ${index + 1}`,
        thumbnailUrl: "https://example.com/thumbnail.jpg",
      },
      price: Math.floor(Math.random() * 900) + 100,
      store: {
        id: `store-${Math.floor(Math.random() * 10) + 1}`,
        name: `Store ${Math.floor(Math.random() * 10) + 1}`,
        location: {
          address: `${Math.floor(Math.random() * 1000)} Main St`,
          city: "San Francisco",
          country: "USA",
        },
        contact: {
          phone: `+1 (555) ${Math.floor(Math.random() * 9000) + 1000}`,
          email: `store${Math.floor(Math.random() * 10) + 1}@example.com`,
        },
        operatingHours: {
          days: "Mon-Sun",
          hours: "9:00 AM - 6:00 PM",
        },
      },
      rating: Math.random() * 3 + 2,
      location: `Location ${Math.floor(Math.random() * 10) + 1}`,
      coordinates: [
        37.7749 + (Math.random() - 0.5) * 0.1,
        -122.4194 + (Math.random() - 0.5) * 0.1,
      ] as [number, number],
    };
  });

function Planning() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);
  const [hasPassedPhaseTwo, setHasPassedPhaseTwo] = useState(false);
  const [submissionData, setSubmissionData] = useState<{
    budgetDistribution: BudgetDistribution[];
    recommendations: Record<string, RecommendationItem[]>;
    products: Product[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<Error | null>(null);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const phaseOneRef = useRef<HTMLDivElement | null>(null);

  const { mutate: submitHome } = useHomeSubmission();

  const handleFormSubmit = useCallback(
    (data: FormData) => {
      setIsSubmitting(true);
      setSubmissionError(null);
      console.log(data);
      submitHome(data, {
        onSuccess: (response) => {
          console.log("Submission successful with data:", response);
          setFormData(data);
          setIsFormSubmitted(true);
          setHasPassedPhaseOne(true);
          setSubmissionData(response.data);
          setIsSubmitting(false);
        },
        onError: (error) => {
          console.error("Submission error:", error);
          setSubmissionError(error);
          setIsSubmitting(false);
        },
      });
    },
    [submitHome]
  );
  console.log(submissionData);
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
        <PhaseOne onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      </div>
      <PhaseTwo
        formData={formData}
        isFormSubmitted={isFormSubmitted}
        hasPassedPhaseOne={hasPassedPhaseOne}
        recommendationsData={
          isFormSubmitted && submissionData
            ? {
                budgetDistribution: submissionData.budgetDistribution,
                recommendations: submissionData.recommendations,
              }
            : fakeRecommendationsData
        }
        isLoading={isSubmitting}
        error={submissionError}
      />
      <PhaseThree
        formData={formData}
        isFormSubmitted={isFormSubmitted}
        hasPassedPhaseTwo={hasPassedPhaseTwo}
        productsData={
          isFormSubmitted && submissionData
            ? submissionData.products
            : SAMPLE_PRODUCTS
        }
        isLoading={isSubmitting}
        error={submissionError}
      />
      <PhaseFour
        formData={formData || undefined}
        recommendations={
          isFormSubmitted && submissionData
            ? submissionData.recommendations
            : fakeRecommendationsData.recommendations
        }
      />
      <PhaseFive
        formData={formData || undefined}
        budgetDistribution={
          isFormSubmitted && submissionData
            ? submissionData.budgetDistribution
            : fakeRecommendationsData.budgetDistribution
        }
        recommendations={
          isFormSubmitted && submissionData
            ? submissionData.recommendations
            : fakeRecommendationsData.recommendations
        }
        products={
          isFormSubmitted && submissionData
            ? submissionData.products
            : SAMPLE_PRODUCTS
        }
      />
    </div>
  );
}

export default Planning;
