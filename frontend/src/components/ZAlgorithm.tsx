import React, { useState } from "react";
import { Cell } from "./Cell";
import type { Step } from "../types/types";
import { run_z_algorithm } from "../api/algorithmApi";
import { Pointer } from "./Pointer";
import { useNavigate } from "react-router-dom";
import { Variable } from "./Variables";

export const ZAlgorithm: React.FC = () => {
  const [text, setText] = useState("");
  const [pattern, setPattern] = useState("");
  const [combined, setCombined] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [res, setRes] = useState<number[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!pattern || !text) {
      setError("Both text and pattern are required.");
      return;
    }
  
    if (pattern.length > text.length) {
      setError("Pattern cannot be longer than text.");
      return;
    }
    const data = await run_z_algorithm(text, pattern);

    setCombined(pattern + "$" + text);
    setSteps(data.steps);
    setRes(data.res);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goBack = () => {
    navigate('/')
  }

  return (
    <>
      <div className="flex flex-col items-center mb-10">
        <button 
          className="w-60 bg-gray-700 text-white cursor-pointer font-bold py-2 px-4 rounded hover:bg-[#0d0e0d] hover:text-[#00df9a] transition-colors"
          onClick={goBack}
        >
            Back
          </button>
      </div>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        {/* Top Row */}
        <div className="flex lg:h-90 gap-6 p-6">
          
          {/* Left Column: Form */}
          <div className="flex-1 bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold mb-4">Input</h2>
            <div
                className={`px-2 py-1 rounded text-sm transition-opacity mb-2.5 duration-200 ${
                  error ? "bg-red-600 text-white opacity-100" : "opacity-0"
                }`}
              >
                {error}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="p-2 rounded text-white"
              />
              <input
                type="text"
                placeholder="Pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="p-2 rounded text-white"
              />

              <button
                type="submit"
                className="bg-gray-700 text-white cursor-pointer font-bold py-2 px-4 rounded hover:bg-gray-900 hover:text-[#00df9a] transition-colors"
              >
                Run Z-Algorithm
              </button>

              <div className="flex mt-3 gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full bg-gray-700 text-white cursor-pointer font-bold py-2 px-4 rounded hover:bg-gray-900 hover:text-[#00df9a] transition-colors"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gray-700 text-white cursor-pointer font-bold py-2 px-4 rounded hover:bg-gray-900 hover:text-[#00df9a] transition-colors"
                >
                  Next
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Variables Display */}
          <div className="flex-1 bg-gray-800 rounded-lg p-6 shadow-md overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold mb-4">Variables</h2>
     
            <div className="space-y-2.5 p-4 bg-gray-800 rounded-lg shadow-md">
              <Variable char={'k'} val={String(steps[currentStep]?.k ?? '-')} reveal={true} />
              <Variable char={'l'} val={String(steps[currentStep]?.l ?? '-')} reveal={true} />
              <Variable char={'r'} val={String(steps[currentStep]?.r ?? '-')} reveal={true} />
              <Variable char={'z array'} val={String(steps[currentStep]?.z_array?.join(", ") ?? "-")} reveal={true} />
              <Variable char={'result (text-index)'} val={res.length > 0 ? String(res?.join(", ")) : "no match"} reveal={false} />
            </div>

          </div>
        </div>

        {/* Bottom Row: Animation */}
        <div className="flex-1 bg-gray-700 p-6 flex items-center justify-center">
          <div className="overflow-x-auto w-full custom-scrollbar mx-4">
            <div className="inline-flex space-x-2 min-w-full justify-center">
              {combined.split("").map((char, i) => {
                let highlight: "normal" | "match" | "mismatch" | "copy" = "normal";
                const step = steps[currentStep];
                
                if (step?.comparison) {
                  const [a, b] = step.comparison;
                  if (i === a) highlight = step.match ? "match" : "mismatch";
                  if (i === b) highlight = step.match ? "match" : "mismatch";
                }

                if (step?.k1) {
                  if (i === step.k1) highlight = "copy";
                }

                // Determine pointer label for this position
                let pointerLabel: string | null = null;
                if (step) {
                  if (step.l === i && step.r === i && step.k === i) {
                    pointerLabel = "lrk";
                  } else if (step.l === i && step.r === i) {
                    pointerLabel = "lr";
                  } else if (step.r === i && step.k === i) {
                    pointerLabel = "rk";
                  } else if (step.l === i && step.k === i) {
                    pointerLabel = "lk";
                  } else if (step.k === i) {
                    pointerLabel = "k";
                  } else if (step.l === i) {
                    pointerLabel = "l";
                  } else if (step.r === i) {
                    pointerLabel = "r";
                  }
                }

                return (
                  pointerLabel ? 
                  (<div key={i} className="flex flex-col items-center gap-2">
                    <Cell char={char} highlight={highlight} />
                    {pointerLabel && <Pointer label={pointerLabel} />}
                  </div>) :
                  (<div key={i}>
                    <Cell char={char} highlight={highlight} />
                  </div>)
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
