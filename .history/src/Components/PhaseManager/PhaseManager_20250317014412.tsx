"use client";

import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PhaseOne from "../PhaseOne/PhaseOne";
import PhaseTwo from "../PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";

interface PhaseManagerProps {
  currentPhase: number;
  onPhaseChange: (phase: number) => void;
}

const PhaseManager: FC<PhaseManagerProps> = ({
  currentPhase,
  onPhaseChange,
}) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [toastId, setToastId] = useState<string | null>(null);

  // Handle form submission
  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setIsFormSubmitted(true);
    if (toastId) {
      toast.dismiss(toastId);
      setToastId(null);
    }
  };

  // Manage toast notifications based on phase and form submission
  useEffect(() => {
    // Dismiss existing toast if any
    if (toastId) {
      toast.dismiss(toastId);
    }

    // Show toast only if:
    // 1. User is not in Phase One
    // 2. Form is not submitted
    // 3. User is viewing preview data
    if (currentPhase > 1 && !isFormSubmitted) {
      const newToastId = toast(
        "This is fake data for preview. Take a look, but you need to fill in your data to get started.",
        {
          duration: Infinity,
          position: "top-right",
          icon: "ℹ️",
        }
      );
      setToastId(newToastId);
    }

    // Cleanup function
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [currentPhase, isFormSubmitted]);

  return (
    <div className="w-full">
      {currentPhase === 1 && (
        <PhaseOne onSubmit={handleFormSubmit} initialData={formData} />
      )}
      {currentPhase === 2 && (
        <PhaseTwo
          formData={formData}
          isFormSubmitted={isFormSubmitted}
          isPreviewMode={!isFormSubmitted}
        />
      )}
      {/* Add more phases as needed */}
    </div>
  );
};

export default PhaseManager;
