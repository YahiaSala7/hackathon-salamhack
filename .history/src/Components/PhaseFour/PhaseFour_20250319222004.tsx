import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { toast } from "react-hot-toast";
import { FormData } from "@/types/formData";
import { Category } from "@/types/product";
import { RecommendationsByCategory } from "@/types/recommendations";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";

interface PhaseFourProps {
  formData?: FormData;
  recommendations?: RecommendationsByCategory;
}

function PhaseFour({ formData, recommendations }: PhaseFourProps) {
  const [selectedRoom, setSelectedRoom] = useState<Category | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roomCategories: Category[] = [
    "Living Room",
    "Bedrooms",
    "Bathrooms",
    "Kitchen",
    "Other Rooms",
  ];

  const generatePrompt = (roomCategory: Category) => {
    // Use fake data if formData doesn't exist
    const location = formData?.location || "Giza, Egypt";
    const area = formData?.area || 150;
    const areaUnit = formData?.areaUnit || "m²";
    const style = formData?.style || "modern";

    // Use recommendations from props or fallback to fake data
    const roomItems =
      (recommendations || fakeRecommendationsData.recommendations)?.[
        roomCategory
      ] || [];
    const itemsList = roomItems.map((item) => item.title).join(", ");

    const prompt = `Generate an image of a ${roomCategory} interior design for a home in ${location}. The home has an area of ${area} ${areaUnit}. Consider the following:

${itemsList}
Appropriate layout and design for the room size.
Climate considerations for ${location}.
${style} design style.
Capture the entire room with a good camera angle to clearly show all contents.

Full recommendations data for ${roomCategory}:
${JSON.stringify(roomItems, null, 2)}`;

    console.log("Generated Prompt:", prompt);
    return prompt;
  };

  const handleGenerateImage = async (roomCategory: Category) => {
    try {
      setIsLoading(true);
      setSelectedRoom(roomCategory);

      const prompt = generatePrompt(roomCategory);

      console.log("Sending request to API with prompt:", prompt);

      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      console.log("API Response data:", data);

      setGeneratedImage(data.imageUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            AI-Generated Room Designs
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Visualize your dream rooms with AI-generated interior designs.
            Select a room type below to generate a personalized design based on
            your preferences and requirements.
          </p>
        </div>

        {/* Image Display Area */}
        <div className="mb-8">
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600">Generating your design...</p>
              </div>
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt={`${selectedRoom} design`}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500">
                Select a room type to generate a design
              </p>
            )}
          </div>
        </div>

        {/* Room Selection Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {roomCategories.map((room) => (
            <Button
              key={room}
              onClick={() => handleGenerateImage(room)}
              disabled={isLoading}
              className={`w-full py-6 text-lg font-semibold ${
                selectedRoom === room
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}>
              {room}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhaseFour;
