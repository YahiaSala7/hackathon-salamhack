import React, { useEffect, useState } from "react";

interface LoadingOverlayProps {
  progress: number;
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ progress, isLoading }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isLoading && animatedProgress < progress) {
      progressInterval = setInterval(() => {
        setAnimatedProgress((prev) => {
          const nextProgress = prev + 10;
          return nextProgress > progress ? progress : nextProgress;
        });
      }, 500);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isLoading, progress, animatedProgress]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg flex flex-col items-center gap-4 max-w-md text-center">
        {/* House Icon */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-button">
          <path
            d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Title */}
        <h2 className="text-xl font-bold text-heading">
          Processing Your Request
        </h2>

        {/* Description */}
        <p className="text-text/80 text-sm">
          We are analyzing your requirements and generating personalized
          recommendations. This process may take several minutes as we carefully
          consider all aspects of your home design.
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-button transition-all duration-500 ease-in-out"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className="space-y-1">
          <p className="text-text font-medium">
            {animatedProgress < 100 ? `Processing... ${animatedProgress}%` : "Complete!"}
          </p>
          <p className="text-text/60 text-sm">
            Please do not close this window or refresh the page
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
