import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { PhaseTwoData } from "@/types/phaseTwo";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

// Preview data
const previewData: PhaseTwoData = {
  budgetDistribution: [
    { name: "Living Room", value: 30 },
    { name: "Kitchen", value: 20 },
    { name: "Bedrooms", value: 20 },
    { name: "Bathrooms", value: 15 },
    { name: "Other Rooms", value: 15 },
  ],
  recommendations: {
    "Living Room": [
      {
        id: 1,
        title: "Modern Sofa",
        category: "Living Room",
        price: "50$",
        rating: 4,
        description:
          "Our team was inspired by the seven skills of highly effective programmers",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3",
      },
      // ... keep other Living Room items
    ],
    Kitchen: [
      {
        id: 5,
        title: "Modern Kitchen Cabinet",
        category: "Kitchen",
        price: "80$",
        rating: 5,
        description: "High-quality kitchen cabinet with modern design",
        image:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3",
      },
      // ... keep other Kitchen items
    ],
    Bedrooms: [
      {
        id: 8,
        title: "Queen Size Bed",
        category: "Bedrooms",
        price: "150$",
        rating: 5,
        description: "Comfortable queen size bed with storage",
        image:
          "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3",
      },
      // ... keep other Bedroom items
    ],
    Bathrooms: [
      {
        id: 11,
        title: "Bathroom Vanity",
        category: "Bathrooms",
        price: "100$",
        rating: 4,
        description: "Modern bathroom vanity with mirror",
        image:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3",
      },
      // ... keep other Bathroom items
    ],
  },
};

export const usePhaseTwoData = (homeId?: string) => {
  // Query for checking if home data is submitted
  const submissionQuery = useQuery({
    queryKey: ["homeSubmission", homeId],
    queryFn: async () => {
      if (!homeId) return { isSubmitted: false };
      return api.checkHomeSubmission(homeId);
    },
    enabled: !!homeId,
  });

  // Query for fetching actual data
  const dataQuery = useQuery({
    queryKey: ["phaseTwoData", homeId],
    queryFn: () => api.getPhaseTwoData(homeId!),
    enabled: !!homeId && submissionQuery.data?.data?.isSubmitted,
  });

  // Show toast for preview data
  useEffect(() => {
    if (
      !homeId ||
      (submissionQuery.data && !submissionQuery.data.data?.isSubmitted)
    ) {
      const toastId = "preview-data";
      if (!toast.isActive(toastId)) {
        toast.error(
          "This is fake data for preview. Please fill your data in Phase One to get started.",
          {
            id: toastId,
            duration: Infinity,
            position: "top-right",
          }
        );
      }
    } else if (submissionQuery.data?.data?.isSubmitted) {
      toast.dismiss("preview-data");
    }
  }, [homeId, submissionQuery.data]);

  // Return preview data if no homeId or data not submitted
  if (
    !homeId ||
    (submissionQuery.data && !submissionQuery.data.data?.isSubmitted)
  ) {
    return {
      data: previewData,
      isPreview: true,
      isLoading: false,
      error: null,
    };
  }

  return {
    data: dataQuery.data?.data,
    isPreview: false,
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
  };
};
