import React from "react";

interface MessageAlertProps {
  title?: string;
  icon?: React.ReactNode;
  message: string;
  className?: string;
}

const MessageAlert: React.FC<MessageAlertProps> = ({
  title = "Thông báo",
  icon = "⚠️",
  message,
  className = "",
}) => {
  return (
    <div
      className={`bg-[#f8f9fa] p-5 rounded-xl border-l-4 border-[#e74c3c] mb-6 ${className}`}
    >
      <div className="font-bold text-[#e74c3c] mb-2 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-gray-600 leading-relaxed text-sm">{message}</div>
    </div>
  );
};

export default MessageAlert;
