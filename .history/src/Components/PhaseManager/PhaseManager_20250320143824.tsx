import React, { useState, useEffect } from "react";
import PhaseOne from "../PhaseOne/PhaseOne";
import PhaseTwo from "../PhaseTwo/PhaseTwo";
import PhaseThree from "../PhaseThree/PhaseThree";
import PhaseFour from "../PhaseFour/PhaseFour";
import PhaseFive from "../PhaseFive/PhaseFive";
import { useCombinedData } from "@/hooks/useCombinedData";
import { FormData } from "@/types/formData";

const PhaseManager: React.FC = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);
  const [hasPassedPhaseTwo, setHasPassedPhaseTwo] = useState(false);

  const {
    data: combinedData,
    isLoading,
    error,
  } = useCombinedData(isFormSubmitted);

  useEffect(() => {
    // Check if we have submission data in localStorage
    const storedData = localStorage.getItem("submissionData");
    if (storedData) {
      setIsFormSubmitted(true);
      setHasPassedPhaseOne(true);
      setHasPassedPhaseTwo(true);
    }
  }, []);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setIsFormSubmitted(true);
    setHasPassedPhaseOne(true);
  };

  return (
    <div className="space-y-20">
      <div id="phase-one">
        <PhaseOne onSubmit={handleFormSubmit} />
      </div>

      <div id="phase-two">
        <PhaseTwo
          formData={formData}
          isFormSubmitted={isFormSubmitted}
          hasPassedPhaseOne={hasPassedPhaseOne}
          recommendationsData={{
            budgetDistribution: combinedData?.budgetDistribution || [],
            recommendations: combinedData?.recommendations || {},
          }}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div id="phase-three">
        <PhaseThree
          formData={formData}
          isFormSubmitted={isFormSubmitted}
          hasPassedPhaseTwo={hasPassedPhaseTwo}
          productsData={combinedData?.products || []}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div id="phase-four">
        <PhaseFour
          formData={formData}
          recommendations={combinedData?.recommendations}
        />
      </div>

      <div id="phase-five">
        <PhaseFive
          formData={formData}
          budgetDistribution={combinedData?.budgetDistribution}
          recommendations={combinedData?.recommendations}
          products={combinedData?.products}
        />
      </div>
    </div>
  );
};

export default PhaseManager;
