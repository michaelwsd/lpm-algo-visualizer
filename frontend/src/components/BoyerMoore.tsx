import React, { useState } from "react";
import { Cell } from "./Cell";
import type { BMStep, Preprocess } from "../types/types";
import { run_boyer_moore } from "../api/algorithmApi";
import { Pointer } from "./Pointer";
import { useNavigate } from "react-router-dom";
import { Variable } from "./Variables";

export const BoyerMoore: React.FC = () => {
  const [text, setText] = useState("");
  const [pattern, setPattern] = useState("");
  const [txt, setTxt] = useState("");
  const [pat, setPat] = useState("");
  const [steps, setSteps] = useState<BMStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [preprocess, setPreprocess] = useState<Preprocess>();
  const [res, setRes] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [exp, setExp] = useState("Input text and pattern to run the algorithm!");
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

    const data = await run_boyer_moore(text, pattern);

    setTxt(text);
    setExp("String matching starts!")
    setPat(pattern);
    setSteps(data.steps);
    setPreprocess(data.preprocess);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next < steps.length) {
        const step = steps[next];
        setExp(get_explanation(step));
        return next;
        }
        return prev
    });
  };

  const get_explanation = (step: BMStep): string => {
    if (step) {
        if (step.type === 'compare' && step.comparison) {
            const [pIdx, tIdx] = step.comparison;
            return (
            step.match
                ? `Comparing index ${pIdx} of pattern with index ${tIdx} of text, it's a match :)`
                : `Comparing index ${pIdx} of pattern with index ${tIdx} of text, it's not a match :(`
            );
        } else if (step.type === 'match') {
            if (step.res) setRes(step.res);
            return `We have a full match, shift by the maximum matched prefix, which is ${step.shift_len} position(s)`
        } else if (step.type === 'shift') {
            return `We have encountered a mismatch. The bad character rule shift is ${step.bc}, the good character rule shift is ${step.gs}, we pick the largest of the two and shift by ${step.shift_len} position(s)`
        } else if (step.type === 'skip') {
            return `We can apply Galil's optimization here and skip ${step.skip} positions to index ${step.pointer} in pattern`
        } else if (step.type === 'finished') {
            return `Algorithm finished, result is [${res.join(', ')}]`
        }
    }

    return exp;
  }
  
  const prevStep = () => {
    setCurrentStep((prev) => {
      const next = prev - 1;
      if (next >= 0) {
        const step = steps[next];
        setExp(get_explanation(step));
        return next;
      }
      return prev;
    });
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
                Run Boyer-Moore Algorithm
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
        
        
          <div className="flex-1 bg-gray-800 rounded-lg p-6 shadow-md overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold mb-4">Preprocessing</h2>
     
            <div className="space-y-6 p-4 bg-gray-800 rounded-lg shadow-md">
                <Variable
                    char="Rk"
                    val={
                        <div className="flex flex-col space-y-2">
                        {/* amap */}
                        {preprocess?.amap?.length ? (
                            <div className="space-y-1 space-x-3">
                            {preprocess.amap.map((val, i) => (
                                <span key={i}>{val}</span>
                            ))}
                            </div>
                        ) : '-'}

                        {/* rk */}
                        {preprocess?.rk?.length ? (
                            <div className="flex flex-col space-y-1">
                            {preprocess.rk.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex space-x-3">
                                {row.map((cell, cellIndex) => (
                                    <span key={cellIndex}>{cell}</span>
                                ))}
                                </div>
                            ))}
                            </div>
                        ) : null}
                        </div>
                    }
                    reveal={true}
                />
                <Variable 
                    char="gs" 
                    val={preprocess?.gs ? preprocess.gs.join(", ") : "-"} 
                    reveal={true} 
                />
                <Variable 
                    char="mp" 
                    val={preprocess?.mp ? preprocess.mp.join(", ") : "-"} 
                    reveal={true} 
                />

                <Variable char={'result (text-index)'} val={res.length > 0 ? String(res?.join(", ")) : "no match"} reveal={true} />
            </div>
          </div>

          {/* Right Column: Variables Display */}
          <div className="flex-1 bg-gray-800 rounded-lg p-6 shadow-md overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold mb-4">Explanation</h2>
     
            <div className="font-semibold space-y-2.5 p-4 bg-gray-800 rounded-lg shadow-md">
              {exp}
            </div>

          </div>
        </div>

        {/* Bottom Row: Animation */}
        <div className="flex-1 bg-gray-700 p-6 flex flex-col items-start justify-center">
            <div className="overflow-x-auto w-full custom-scrollbar">
                <div className="inline-block min-w-max">
                    {/* Text row */}
                    <div className="flex">
                        {txt.split("").map((char, i) => {
                        let highlight: "normal" | "match" | "mismatch" | "copy" = "normal";
                        const step = steps[currentStep];
                        if (step?.comparison) {
                            const [_, b] = step.comparison;
                            if (i === b) highlight = step.match ? "match" : "mismatch";
                        }
                        return <Cell key={i} char={char} highlight={highlight} />;
                        })}
                    </div>

                    {/* Pattern row */}
                    <div
                    className="flex"
                    style={{
                        marginLeft: `${steps[currentStep]?.pos * 10.2 || 0}ch`,
                        transition: "margin-left 0.5s ease", // smooth transition
                    }}
                    >
                        {pat.split("").map((char, i) => {
                        let highlight: "normal" | "match" | "mismatch" | "copy" = "normal";
                        const step = steps[currentStep];
                        const pointerLabel = i === step.pointer ? String(i) : null

                        if (step?.comparison) {
                            const [a, _] = step.comparison;
                            if (i === a) highlight = step.match ? "match" : "mismatch";
                        }
                        if (step?.type === 'skip' && step.skip) {
                            if (i > step.pointer && i <= step.pointer + step.skip) {
                                highlight = 'copy'
                            }
                        }
                        return (
              
                            (<div key={i} className="flex flex-col items-center gap-2">
                                <Cell char={char} highlight={highlight} />
                                <div className="h-9"> {/* reserve space for pointer */}
                                    {pointerLabel && <Pointer label={pointerLabel} />}
                                </div>
                            </div>)
                        );
                        })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
