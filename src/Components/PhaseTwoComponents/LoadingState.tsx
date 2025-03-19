import { FC } from "react";

interface LoadingStateProps {
  isLoading: boolean;
  error: Error | null;
  displayData: any;
}

export const LoadingState: FC<LoadingStateProps> = ({
  isLoading,
  error,
  displayData,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">
            Error loading recommendations
          </p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-center">
          No recommendations available yet. Please submit the form first.
        </p>
      </div>
    );
  }

  return null;
};
