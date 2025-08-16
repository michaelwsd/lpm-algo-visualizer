import { useState } from "react";
import React from "react";

interface VariableProps {
  char: string;
  val: any;
  reveal: boolean
}

export const Variable: React.FC<VariableProps> = ({ char, val, reveal }) => {
  const [revealed, setRevealed] = useState(reveal);

  const handleClick = () => setRevealed(!revealed);

  return (
    <div className="flex justify-between items-center">
      <span className="font-bold text-gray-300">{char} :</span>
      <span
        onClick={handleClick}
        className="bg-gray-700 px-3 py-1 rounded font-semibold text-white cursor-pointer select-none max-w-120 ml-5"
      >
        {revealed ? val : "•••"}
      </span>
    </div>
  );
};