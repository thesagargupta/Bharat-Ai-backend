import React from "react";

export default function BharatAiLogo({ size = 'md', className = '' }) {
  // Responsive presets to make the component reusable - matching previous heading styles
  const sizes = {
    sm: { 
      text: 'text-4xl sm:text-3xl md:text-4xl', 
      square: 'w-14 h-14 sm:w-12 sm:h-12 md:w-14 md:h-14',
      aiText: 'text-[3.35rem] sm:text-[2.5rem] md:text-[3.35rem] lg:text-[2rem]'
    },
    md: { 
      text: 'text-5xl sm:text-4xl md:text-5xl lg:text-6xl', 
      square: 'w-18 h-18 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20',
      aiText: 'text-[4rem] sm:text-[3rem] md:text-[4rem] lg:text-[2.5rem] xl:text-[3rem]'
    },
    lg: { 
      text: 'text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl', 
      square: 'w-20 h-20 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28',
      aiText: 'text-[3rem] sm:text-[3rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem]'
    },
  };
  const s = sizes[size] || sizes.lg;

  return (
    <div className={`inline-flex items-center bg-transparent ${className}`} aria-label="Bharat AI logo">
      {/* "Bharat" — elegant gradient text matching previous heading */}
      <span className={`${s.text} font-bold leading-none bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent tracking-tight`}>
        Bharat
      </span>

      {/* Orange square with bold white "AI" - bigger than Bharat text */}
      <span
        className={`${s.square} ${s.aiText} ml-4 sm:ml-3 md:ml-4 inline-flex items-center justify-center bg-[#e85a12] text-white font-extrabold leading-none uppercase rounded-lg shadow-lg`}
        aria-hidden="true"
      >
        AI
      </span>
    </div>
  );
}
