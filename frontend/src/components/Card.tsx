import React from "react";

interface CardProps {
    title: string;
    href: string;
}

export const Card: React.FC<CardProps> = ({ title, href }) => {
    return (
        <a
        href={href}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg flex flex-col justify-center items-center p-6 
                    hover:shadow-2xl hover:scale-105 hover:-translate-y-1 
                    hover:bg-[#020202] transition-all duration-300 ease-out 
                    aspect-square w-full sm:w-[200px] md:w-[350px] lg:w-[500px] m-2 hover:text-[#00df9a]"
        >
            <h2 className="font-bold mb-2 text-center text-2xl">
                {title}
            </h2>
        </a>
    );
  };