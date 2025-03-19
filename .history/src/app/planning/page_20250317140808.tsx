"use client";

import { useState, useEffect } from "react";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";

function Planning() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setIsFormSubmitted(true);
    setHasPassedPhaseOne(true);
  };

  // Check if user has scrolled past PhaseOne
  useEffect(() => {
    const handleScroll = () => {
      const phaseOneElement = document.getElementById("phase-one");
      if (phaseOneElement) {
        const rect = phaseOneElement.getBoundingClientRect();
        if (rect.bottom < 0) {
          setHasPassedPhaseOne(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="container mx-auto">
      <div id="phase-one">
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
