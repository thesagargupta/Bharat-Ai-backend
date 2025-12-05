"use client";
import React from "react";
import { FiImage, FiUpload, FiX } from "react-icons/fi";

export default function ToolSelector({
  selected,
  onToggle,
  onUploadClick,
  onRemove,
  onExitImageGen,
}) {
  const tools = [
    { id: "image-gen", label: "Generate Image", icon: <FiImage /> },
    { id: "upload", label: "Upload Image", icon: <FiUpload /> },
  ];
  return (
    <div className="w-full">
      {/* Tools Row */}
      <div className="flex gap-3 items-center mt-3">
        {tools.map((t) => {
          const active = selected.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={(e) => {
                e.preventDefault();
                if (t.id === "upload") {
                  onUploadClick();
                } else {
                  onToggle(t.id);
                }
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition
                ${active ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg" : "bg-white text-gray-700 border"}
              `}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active tool pills */}
      <div className="mt-3 flex gap-2 items-center flex-wrap">
        {selected.map((s) => {
          const label = s === "image-gen" ? "Image Generation" : s === "upload" ? "Uploaded Image" : s;
          return (
            <div
              key={s}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
            >
              <span className="text-sm">{label}</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (s === "image-gen" && onExitImageGen) {
                    onExitImageGen();
                  } else {
                    onRemove(s);
                  }
                }} 
                className="p-1 rounded-full hover:bg-indigo-100"
              >
                <FiX />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
