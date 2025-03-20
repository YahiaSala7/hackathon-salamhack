import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { toast } from "react-hot-toast";
import { FormData } from "@/types/formData";
import { Category } from "@/types/product";
import { RecommendationsByCategory } from "@/types/recommendations";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";
import { useImageGeneration } from "@/hooks/useImageGeneration";

interface PhaseFourProps {
  formData?: FormData;
  recommendations?: RecommendationsByCategory;
}

function PhaseFour({ formData, recommendations }: PhaseFourProps) {
  const [selectedRoom, setSelectedRoom] = useState<Category | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { mutate: generateImage, isPending, isError } = useImageGeneration();

  const roomCategories: Category[] = [
    "Living Room",
    "Bedroom",
    "Bathroom",
    "Kitchen",
    "Other Rooms",
  ];

  // Progress animation effect
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    if (isPending) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
    }
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPending]);

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

  const handleGenerateImage = (roomCategory: Category) => {
    setSelectedRoom(roomCategory);
    const prompt = generatePrompt(roomCategory);

    generateImage(
      { prompt },
      {
        onSuccess: (data) => {
          setProgress(100);
          setTimeout(() => {
            setGeneratedImage(data.imageUrl);
            setProgress(0);
            toast.success("Image generated successfully!");
          }, 500);
        },
        onError: () => {
          setProgress(0);
          toast.error("Failed to generate image. Please try again.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-left mb-12">
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
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
            {isPending ? (
              <div className="flex flex-col items-center gap-4 p-8">
                {/* House Icon */}
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-blue-500">
                  <path
                    d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Progress Bar */}
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Progress Text */}
                <p className="text-gray-600 font-medium">
                  {progress < 100
                    ? `Generating your design... ${progress}%`
                    : "Complete!"}
                </p>
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
            <button
              key={room}
              onClick={() => handleGenerateImage(room)}
              disabled={isPending}
              className={`w-full text-lg font-semibold text-white flex justify-center gap-2 px-5 py-4 rounded-md cursor-pointer ${
                selectedRoom === room
                  ? "bg-heading hover:bg-[#1A1F2C]  "
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}>
              {room}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhaseFour;
