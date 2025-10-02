import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AnimateRoutes } from "./AnimateRoutes";

export const AlgorithmVisualizer: React.FC = () => {

    return (
        <>
            <BrowserRouter>
                <div className="flex items-center justify-center h-40 max-w-[1240px] mx-auto px-4 group">
                    <h1 className="text-3xl font-bold transition-all duration-500 bg-gradient-to-r from-[#00df9a] via-[#00c4df] to-[#00df9a] bg-[length:200%_200%] bg-clip-text text-transparent group-hover:animate-gradient-move">
                        Linear-time Pattern Matching Algorithms Visualizer
                    </h1>
                </div>
                
                <AnimateRoutes />
            </BrowserRouter>
        </>
    )
}