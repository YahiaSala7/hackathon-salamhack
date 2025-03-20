import React, { useState } from "react";
import { Category } from "@/types/product";
import { api } from "@/services/api";
import { toast } from "react-hot-toast";
import { FormData } from "@/types/formData";
import { RecommendationsByCategory } from "@/types/recommendations";

const ROOM_CATEGORIES: Category[] = [
  "Living Room",
  "Bedroom",
  "Bathroom",
  "Kitchen",
  "Other Rooms",
];

interface PhaseFourProps {
  formData: FormData | null;
  recommendations: RecommendationsByCategory;
}

function PhaseFour({ formData, recommendations }: PhaseFourProps) {
  const [selectedRoom, setSelectedRoom] = useState<Category | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoomSelect = async (room: Category) => {
    if (!formData) {
      toast.error("Please complete the form first");
      return;
    }

    setSelectedRoom(room);
    setIsLoading(true);

    try {
      const location = formData.location;
      const area = formData.area;
      const items = recommendations[room]?.map((item) => item.title) || [];

      const response = await api.generateRoomImage(room, location, area, items);

      if (response.success && response.data?.imageUrl) {
        setGeneratedImage(response.data.imageUrl);
      } else {
        toast.error("Failed to generate room image");
      }
    } catch (error) {
      console.error("Error generating room image:", error);
      toast.error("An error occurred while generating the room image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Image Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="aspect-video relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt={`${selectedRoom} interior design`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">
                  Select a room to generate an image
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Room Selection Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ROOM_CATEGORIES.map((room) => (
            <button
              key={room}
              onClick={() => handleRoomSelect(room)}
              disabled={!formData}
              className={`p-4 rounded-lg font-medium transition-colors ${
                selectedRoom === room
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${!formData ? "opacity-50 cursor-not-allowed" : ""}`}>
              {room}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhaseFour;
