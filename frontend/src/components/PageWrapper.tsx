import { useState, useEffect } from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fade out + slide left
    setIsVisible(false);

    const timeout = setTimeout(() => {
      // Switch content
      setDisplayChildren(children);
      // Fade in + slide right
      setIsVisible(true);
    }, 500); // match the duration below

    return () => clearTimeout(timeout);
  }, [children]);

  return (
    <div
      className={`
        transition-all duration-500 ease-in-out
        ${isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-10 scale-95"}
      `}
    >
      {displayChildren}
    </div>
  );
};
