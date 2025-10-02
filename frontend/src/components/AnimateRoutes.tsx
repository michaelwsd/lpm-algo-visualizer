import { useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import { PageWrapper } from "./PageWrapper";
import { Home } from "./Home";
import { ZAlgorithm } from "./ZAlgorithm";
import { BoyerMoore } from "./BoyerMoore";
import ErrorComponent from "./Error";

export const AnimateRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>

          <Routes location={location} key={location.pathname}>

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

        </AnimatePresence>
    )
}
  