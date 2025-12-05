"use client";
import { FiArrowDown } from "react-icons/fi";

export default function ScrollToBottomButton({ onClick, show }) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 sm:right-8 z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 animate-fadeIn flex items-center justify-center group"
      aria-label="Scroll to bottom"
      title="Scroll to bottom"
    >
      <FiArrowDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        New messages
      </span>
    </button>
  );
}
