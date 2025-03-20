import { useMutation } from "@tanstack/react-query";
import { imageApi } from "@/services/imageApi";

interface GenerateImageResponse {
  imageUrl: string;
}

interface GenerateImageRequest {
  prompt: string;
}

const generateImage = async (
  data: GenerateImageRequest
): Promise<GenerateImageResponse> => {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to generate image");
  }

  return response.json();
};

export const useImageGeneration = () => {
  return useMutation({
    mutationFn: (data: GenerateImageRequest) => imageApi.generateImage(data),
    onError: (error) => {
      console.error("Error generating image:", error);
      throw error;
    },
  });
};
