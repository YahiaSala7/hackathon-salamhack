import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { toast } from "react-hot-toast";
import { FormData } from "@/types/formData";
import { Category } from "@/types/product";
import { RecommendationsByCategory } from "@/types/recommendations";

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
    "Bedroom",
    "Bathroom",
    "Kitchen",
    "Other Rooms",
  ];

  const generatePrompt = (roomCategory: Category) => {
    if (!formData) return "";

    const roomItems = recommendations?.[roomCategory] || [];
    const itemsList = roomItems.map((item) => item.title).join(", ");

    return `Generate an image of a ${roomCategory} interior design for a home in ${formData.location}. The home has an area of ${formData.area} ${formData.areaUnit}. Consider the following:

${itemsList}
Appropriate layout and design for the room size.
Climate considerations for ${formData.location}.
${formData.style} design style.
Capture the entire room with a good camera angle to clearly show all contents.`;
  };

  const handleGenerateImage = async (roomCategory: Category) => {
    try {
      setIsLoading(true);
      setSelectedRoom(roomCategory);

      const prompt = generatePrompt(roomCategory);

      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
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
