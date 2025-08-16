import React from "react";
import { Card } from "./Card";

export const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center max-w-[1250px] mx-auto px-4 py-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 mt-12 text-white">
        <Card
          title="Z Algorithm"
          href="/z-algo"
        />
        <Card
          title="Boyer-Moore Algorithm"
          href="/boyer-moore"
        />
      </div>
    </div>
  );
};
