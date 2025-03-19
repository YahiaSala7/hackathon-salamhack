"use client";

import { useState } from "react";
import PhaseManager from "@/Components/PhaseManager/PhaseManager";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [currentPhase, setCurrentPhase] = useState(1);

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster />
      <PhaseManager
        currentPhase={currentPhase}
        onPhaseChange={setCurrentPhase}
      />
    </main>
  );
}
