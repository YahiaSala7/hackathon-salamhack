import React from "react";

interface LoadingOverlayProps {
  progress: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg flex flex-col items-center gap-4">
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

        {/* Progress Bar */}
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-button transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Text */}
        <p className="text-text font-medium">
          {progress < 100 ? `Loading... ${progress}%` : "Complete!"}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
