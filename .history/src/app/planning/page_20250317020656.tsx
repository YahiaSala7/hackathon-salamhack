"use client";

import { useState } from "react";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";

function Planning() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setIsFormSubmitted(true);
  };

  return (
    <div className="container mx-auto">
      <PhaseOne onSubmit={handleFormSubmit} />
      <PhaseTwo formData={formData} isFormSubmitted={isFormSubmitted} />
    </div>
  );
}

export default Planning;
