import React from "react";
import { FaSpinner } from "react-icons/fa";

interface LoadingProps {
  text?: string;
  size?: string;
  color?: string;
  icon?: React.ReactNode;
  showRetryButton?: boolean;
  onRetry?: () => void;
  retryText?: string;
  onClick?: () => void; // Thêm onClick cho component
  clickable?: boolean;  // Cho phép bật/tắt hành vi click
}

const Loading: React.FC<LoadingProps> = ({
  text = "Đang tải...",
  size = "6xl",
  color = "blue-500",
  icon = <FaSpinner className={`text-${color} text-${size} animate-spin`} />,
  showRetryButton = false,
  onRetry,
  retryText = "Thử lại",
  onClick,
  clickable = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[300px] space-y-4 ${
        clickable ? "cursor-pointer hover:opacity-90" : ""
      }`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="flex items-center space-x-4">
        <div className="text-center">{icon}</div>
        <p className="text-lg text-gray-300 animate-pulse">{text}</p>
      </div>

      <div className={`w-12 h-12 border-4 border-${color} border-t-transparent rounded-full animate-spin`}></div>

      {showRetryButton && onRetry && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn click lan ra ngoài
            onRetry();
          }}
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default Loading;
