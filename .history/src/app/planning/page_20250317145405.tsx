"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";

function Planning() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const phaseOneRef = useRef<HTMLDivElement | null>(null);

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
      <PhaseTwo
        formData={formData}
        isFormSubmitted={isFormSubmitted}
        hasPassedPhaseOne={hasPassedPhaseOne}
      />
    </div>
  );
}

export default Planning;
