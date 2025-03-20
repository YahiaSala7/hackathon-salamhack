import { useMutation } from "@tanstack/react-query";

interface GenerateImageResponse {
  image: string;  // Changed from imageUrl to image
}

interface GenerateImageRequest {
  prompt: string;
}

const API_BASE_URL = "https://designture.runasp.net/api/Plan";

const generateImage = async (
  data: GenerateImageRequest
): Promise<GenerateImageResponse> => {
  const response = await fetch(`${API_BASE_URL}/generate-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to generate image");
  }

  const result = await response.json();
  return { image: result.image };
};

export const useImageGeneration = () => {
  return useMutation({
    mutationFn: generateImage,
    onError: (error) => {
      console.error("Error generating image:", error);
      throw error;
    },
  });
};
