import React, { useContext } from "react";
import { DarkModeContext } from "../App";

// A single shimmering placeholder block
export function SkeletonBlock({ className = "" }) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`animate-pulse rounded-lg ${
        darkMode ? "bg-gray-700" : "bg-gray-200"
      } ${className}`}
    />
  );
}

// A grid of placeholder cards shown while data loads
export function SkeletonCards({ count = 6 }) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-xl p-5 shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <SkeletonBlock className="h-44 w-full mb-4" />
          <SkeletonBlock className="h-5 w-3/4 mb-3" />
          <SkeletonBlock className="h-4 w-full mb-2" />
          <SkeletonBlock className="h-4 w-2/3 mb-4" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export default SkeletonCards;
