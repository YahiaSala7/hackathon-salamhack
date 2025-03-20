import React, { useState } from "react";
import PhaseOne from "../PhaseOne/PhaseOne";
import PhaseTwo from "../PhaseTwo/PhaseTwo";
import PhaseThree from "../PhaseThree/PhaseThree";
import PhaseFour from "../PhaseFour/PhaseFour";
import PhaseFive from "../PhaseFive/PhaseFive";
import { FormData } from "@/types/formData";
import { useHomeSubmission } from "@/hooks/useHomeSubmission";
import {
  BudgetDistribution,
  RecommendationItem,
  Product,
} from "@/types/product";

interface SubmissionData {
  budgetDistribution: BudgetDistribution[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

const PhaseManager: React.FC = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(
    null
  );
  const [hasPassedPhaseOne, setHasPassedPhaseOne] = useState(false);
  const [hasPassedPhaseTwo, setHasPassedPhaseTwo] = useState(false);
  const [hasPassedPhaseThree, setHasPassedPhaseThree] = useState(false);
  const [hasPassedPhaseFour, setHasPassedPhaseFour] = useState(false);

  const { mutate: submitHome, isPending: isSubmitting } = useHomeSubmission();

  const handleFormSubmit = async (data: FormData) => {
    try {
      setFormData(data);
      setIsFormSubmitted(true);

      submitHome(data, {
        onSuccess: (response) => {
          console.log("Submission successful with data:", response);
          if (response.data) {
            // Store the data in state
            setSubmissionData({
              budgetDistribution: response.data.budgetDistribution || [],
              recommendations: response.data.recommendations || {},
              products: response.data.products || [],
            });

            // Store in localStorage for persistence
            localStorage.setItem(
              "submissionData",
              JSON.stringify(response.data)
            );
          }
        },
        onError: (error) => {
          console.error("Submission error:", error);
        },
      });
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Phase One */}
      <section id="phase-one" className="min-h-screen">
        <PhaseOne onSubmit={handleFormSubmit} />
      </section>

      {/* Phase Two */}
      <section id="phase-two" className="min-h-screen">
        <PhaseTwo
          formData={formData}
          isFormSubmitted={isFormSubmitted}
          hasPassedPhaseOne={hasPassedPhaseOne}
          recommendationsData={
            submissionData || {
              budgetDistribution: [],
              recommendations: {},
            }
          }
          isLoading={isSubmitting}
          error={null}
        />
      </section>

      {/* Phase Three */}
      <section id="phase-three" className="min-h-screen">
        <PhaseThree
          formData={formData}
          isFormSubmitted={isFormSubmitted}
          hasPassedPhaseTwo={hasPassedPhaseTwo}
          productsData={submissionData?.products || []}
          isLoading={isSubmitting}
          error={null}
        />
      </section>

      {/* Phase Four */}
      <section id="phase-four" className="min-h-screen">
        <PhaseFour
          formData={formData}
          recommendations={submissionData?.recommendations}
        />
      </section>

      {/* Phase Five */}
      <section id="phase-five" className="min-h-screen">
        <PhaseFive
          formData={formData}
          budgetDistribution={submissionData?.budgetDistribution}
          recommendations={submissionData?.recommendations}
          products={submissionData?.products}
        />
      </section>
    </div>
  );
};

export default PhaseManager;
