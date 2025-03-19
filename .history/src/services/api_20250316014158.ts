import { FormData } from "@/types/formData";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fake API endpoint for form submission
export const submitHomeData = async (
  data: FormData
): Promise<{ success: boolean; message: string }> => {
  // Simulate API call
  await delay(1500);

  // Simulate random success/failure
  const random = Math.random();
  if (random < 0.9) {
    // 90% success rate
    return {
      success: true,
      message: "Your home data has been successfully submitted!",
    };
  }

  // Simulate error
  throw new Error("Failed to submit home data. Please try again.");
};
