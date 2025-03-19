import { useQuery } from "@tanstack/react-query";
import {
  getRecommendations,
  hasSubmittedFormData,
  placeholderData,
} from "@/services/recommendationService";
import { UserFormData } from "@/types/recommendation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export const useRecommendations = (formData: UserFormData | null) => {
  const hasSubmitted = hasSubmittedFormData();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendations", formData],
    queryFn: () => getRecommendations(formData!),
    enabled: !!formData && hasSubmitted,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  useEffect(() => {
    if (!hasSubmitted) {
      const toastId = toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Preview Mode
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    This is fake data for preview. Take a look, but you need to
                    fill in your data to get started.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
        }
      );

      const showToastOnScroll = () => {
        if (window.scrollY > 200 && !hasSubmitted) {
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Preview Mode
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        This is fake data for preview. Take a look, but you need
                        to fill in your data to get started.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Close
                  </button>
                </div>
              </div>
            ),
            {
              duration: 5000,
              position: "top-right",
            }
          );
        }
      };

      window.addEventListener("scroll", showToastOnScroll);
      return () => {
        window.removeEventListener("scroll", showToastOnScroll);
        toast.dismiss(toastId);
      };
    }
  }, [hasSubmitted]);

  return {
    data: data || placeholderData,
    isLoading,
    error,
    isPreviewMode: !hasSubmitted,
  };
};
