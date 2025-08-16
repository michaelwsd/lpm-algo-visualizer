import React from "react";

interface CellProps {
  char: string;
  highlight?: "normal" | "match" | "mismatch" | "copy";
}

export const Cell: React.FC<CellProps> = ({ char, highlight = "normal" }) => {
  // background color based on highlight
  let bgColor = "bg-gray-800";
  if (highlight === "match") bgColor = "bg-green-500";
  if (highlight === "mismatch") bgColor = "bg-red-500";
  if (highlight === "copy") bgColor = "bg-blue-500";

  return (
    <div
      className={`w-20 h-20 text-2xl flex items-center justify-center m-1 rounded-lg border border-gray-600 shadow-md text-white font-semibold transition-all duration-300 ${bgColor} hover:scale-105`}
    >
      {char}
    </div>
  );
};
