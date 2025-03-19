"use client";

import { useState } from "react";
import PhaseOne from "@/Components/PhaseOne/PhaseOne";
import PhaseTwo from "@/Components/PhaseTwo/PhaseTwo";
import { FormData } from "@/types/formData";

function Planning() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = (data: FormData) => {
    setFormData(data);
    setIsFormSubmitted(true);
  };

  return (
    <div className="container mx-auto">
      <PhaseOne onSubmit={handleSubmit} />
      <PhaseTwo formData={formData} isFormSubmitted={isFormSubmitted} />
    </div>
  );
}

export default Planning;
