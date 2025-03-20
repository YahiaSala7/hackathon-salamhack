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
import LoadingOverlay from "@/Components/LoadingOverlay/LoadingOverlay";

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
  const [progress, setProgress] = useState(0);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const phaseOneRef = useRef<HTMLDivElement | null>(null);

  const { mutate: submitHome } = useHomeSubmission();

  // Function to store data in multiple ways
  const storeSubmissionData = useCallback((data: any) => {
    // 1. Store in state
    setSubmissionData(data);

    // 2. Store in localStorage
    try {
      localStorage.setItem("submissionData", JSON.stringify(data));
      console.log("Data stored in localStorage:", data);
    } catch (error) {
      console.error("Error storing data in localStorage:", error);
    }

    // 3. Store in sessionStorage
    try {
      sessionStorage.setItem("submissionData", JSON.stringify(data));
      console.log("Data stored in sessionStorage:", data);
    } catch (error) {
      console.error("Error storing data in sessionStorage:", error);
    }

    // 4. Store in a custom event for cross-component communication
    const event = new CustomEvent("submissionDataUpdated", { detail: data });
    window.dispatchEvent(event);
  }, []);

  // Function to retrieve stored data
  const retrieveStoredData = useCallback(() => {
    // Try to get data from localStorage first
    try {
      const localStorageData = localStorage.getItem("submissionData");
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        console.log("Retrieved data from localStorage:", parsedData);
        setSubmissionData(parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error retrieving data from localStorage:", error);
    }

    // Try to get data from sessionStorage
    try {
      const sessionStorageData = sessionStorage.getItem("submissionData");
      if (sessionStorageData) {
        const parsedData = JSON.parse(sessionStorageData);
        console.log("Retrieved data from sessionStorage:", parsedData);
        setSubmissionData(parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error retrieving data from sessionStorage:", error);
    }

    return null;
  }, []);

  // Effect to retrieve stored data on component mount
  useEffect(() => {
    const storedData = retrieveStoredData();
    if (storedData) {
      setIsFormSubmitted(true);
      setHasPassedPhaseOne(true);
    }
  }, [retrieveStoredData]);

  const handleFormSubmit = useCallback(
    (data: FormData) => {
      setIsSubmitting(true);
      setSubmissionError(null);
      setProgress(0);
      console.log("Starting form submission with data:", data);

      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      submitHome(data, {
        onSuccess: (response) => {
          console.log("Submission successful with data:", response);
          clearInterval(progressInterval);
          setProgress(100);

          // Store the submission data using multiple methods
          if (response.data) {
            // Store the complete response data
            storeSubmissionData(response.data);

            // Store form data
            setFormData(data);
            setIsFormSubmitted(true);
            setHasPassedPhaseOne(true);

            // Log the stored data for verification
            console.log("Current submissionData state:", response.data);
            console.log(
              "Data in localStorage:",
              localStorage.getItem("submissionData")
            );
            console.log(
              "Data in sessionStorage:",
              sessionStorage.getItem("submissionData")
            );
          }

          // Wait a moment to show completion
          setTimeout(() => {
            setIsSubmitting(false);
            setProgress(0);
            // Scroll to the next section
            const nextSection = document.getElementById("phase-two");
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: "smooth" });
            }
          }, 1000);
        },
        onError: (error) => {
          console.error("Submission error:", error);
          clearInterval(progressInterval);
          setProgress(0);
          setSubmissionError(error);
          setIsSubmitting(false);
        },
      });
    },
    [submitHome, storeSubmissionData]
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
  console.log(submissionData);

  return (
    <div className="container mx-auto">
      {isSubmitting && <LoadingOverlay progress={progress} />}
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
