import React, { useContext } from "react";
import { DarkModeContext } from "../App";

// Friendly empty-state placeholder with an emoji icon and message
function EmptyState({ icon = "📭", title = "Nothing here yet", subtitle = "", action = null }) {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-2xl py-16 px-6 ${
        darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
      } shadow-lg`}
    >
      <div className="text-6xl mb-4 animate-bounce">{icon}</div>
      <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
        {title}
      </h3>
      {subtitle && <p className="max-w-md mb-4">{subtitle}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
