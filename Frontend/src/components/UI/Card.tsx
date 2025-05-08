import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-gray-800/30 backdrop-blur-lg border border-gray-700 
                  p-4 rounded-2xl shadow-lg transition transform ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
