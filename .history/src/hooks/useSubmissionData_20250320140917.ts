import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import {
  BudgetDistribution,
  RecommendationItem,
  Product,
} from "@/types/product";
import { toast } from "react-hot-toast";

interface SubmissionData {
  budgetDistribution: BudgetDistribution[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

export function useSubmissionData() {
  const queryClient = useQueryClient();

  // Query for getting submission data
  const {
    data: submissionData,
    isLoading,
    error,
  } = useQuery<SubmissionData | null>({
    queryKey: ["submissionData"],
    queryFn: async () => {
      try {
        // Try to get from localStorage first
        const storedData = localStorage.getItem("submissionData");
        if (storedData) {
          return JSON.parse(storedData);
        }
        return null;
      } catch (error) {
        console.error("Error retrieving data from localStorage:", error);
        return null;
      }
    },
    staleTime: Infinity, // Data won't go stale
    gcTime: Infinity, // Cache won't expire
  });

  // Mutation for submitting form data
  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        console.log("Submitting form data:", formData);
        const response = await api.submitHomeData(formData);
        console.log("API response received:", response);
        return response.data;
      } catch (error) {
        console.error("Error in submitForm:", error);
        if (error instanceof Error) {
          toast.error(`Submission failed: ${error.message}`);
        } else {
          toast.error("Failed to submit form. Please try again.");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      try {
        console.log("Storing submission data:", data);

        // Store in localStorage
        localStorage.setItem("submissionData", JSON.stringify(data));
        console.log("Data stored in localStorage");

        // Update the query cache
        queryClient.setQueryData(["submissionData"], data);
        console.log("Data updated in query cache");

        // Store in sessionStorage as backup
        sessionStorage.setItem("submissionData", JSON.stringify(data));
        console.log("Data stored in sessionStorage");

        // Dispatch custom event
        const event = new CustomEvent("submissionDataUpdated", {
          detail: data,
        });
        window.dispatchEvent(event);
        console.log("Custom event dispatched");

        toast.success("Form submitted successfully!");
      } catch (error) {
        console.error("Error storing submission data:", error);
        toast.error("Error saving submission data. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      if (error instanceof Error) {
        toast.error(`Submission failed: ${error.message}`);
      } else {
        toast.error("Failed to submit form. Please try again.");
      }
    },
  });

  return {
    submissionData,
    isLoading,
    error,
    submitForm,
    isPending,
  };
}
