import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

function PhaseFive() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            AI-Powered Report Generation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This phase provides a detailed report summarizing your home setup
            plan, including budget breakdowns, selected furniture & appliances,
            store details, and AI-generated room layouts. The report is
            structured for easy navigation, featuring categorized product lists,
            visual charts, and interactive layouts. Users can download it as a
            PDF or email it for future reference.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            onClick={() => handleDownload()}>
            <Download className="w-5 h-5" />
            Download Your Report
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-navy-900 hover:bg-navy-800 text-white flex items-center gap-2"
            onClick={() => handleShare()}>
            <Share2 className="w-5 h-5" />
            Share Your Report
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PhaseFive;
