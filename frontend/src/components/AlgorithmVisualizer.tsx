import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ZAlgorithm } from "./ZAlgorithm";
import { BoyerMoore } from "./BoyerMoore";
import { Home } from "./Home";
import { PageWrapper } from "./PageWrapper";
import ErrorComponent from "./Error";

export const AlgorithmVisualizer: React.FC = () => {

    return (
        <>
            <BrowserRouter>
                <div className="flex items-center justify-center h-40 max-w-[1240px] mx-auto px-4 group">
                    <h1 className="text-3xl font-bold transition-all duration-500 bg-gradient-to-r from-[#00df9a] via-[#00c4df] to-[#00df9a] bg-[length:200%_200%] bg-clip-text text-transparent group-hover:animate-gradient-move">
                        Linear-time Pattern Matching Algorithms Visualizer
                    </h1>
                </div>
                <Routes>
                    <Route path="/" element={
                        <PageWrapper>
                            <Home />
                        </PageWrapper>
                        } />
                    
                    <Route path="/z-algo" element={
                        <PageWrapper>
                            <ZAlgorithm />
                        </PageWrapper>
                        } />

                    <Route path="/boyer-moore" element={
                        <PageWrapper>
                            <BoyerMoore />
                        </PageWrapper>
                        } />

                    <Route path="/*" element={<ErrorComponent />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}