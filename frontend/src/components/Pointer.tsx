import React from "react";

export const Pointer: React.FC<{ label: string }> = ({ label }) => {
    const isGreen = label !== "k";
  
    return (
      <div className="flex flex-col items-center mb-1">
        <div
          className={`w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent ${
            isGreen ? "border-b-yellow-500" : "border-b-[#00df9a]"
          }`}
        ></div>
        <span className={`font-bold ${isGreen ? "text-yellow-500" : "text-[#00df9a]"}`}>
          {label}
        </span>
      </div>
    );
  };