import { FormData } from "@/types/formData";

// Simulated API delay
const FAKE_API_DELAY = 1500;

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  submitHomeData: async (
    data: FormData
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, FAKE_API_DELAY));

    // Simulate random success/failure (80% success rate)
    const isSuccess = Math.random() > 0.2;

    if (!isSuccess) {
      throw new ApiError(400, "Failed to submit home data. Please try again.");
    }

    return {
      success: true,
      message: "Your home data has been successfully submitted!",
    };
  },
};
