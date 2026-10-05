import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      <div className="w-full flex flex-col items-center pt-1 pb-4 px-4">
        {/* Logo */}
        <img 
          src={`${import.meta.env.BASE_URL}images/logo.webp`}
          alt="TN Govt Logo" 
          className="h-36 w-36 sm:h-44 sm:w-44 object-contain mb-1 mix-blend-multiply hover:scale-105 transition-transform"
        />

        {/* Government of Tamil Nadu with lines */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-px bg-[#d4af37]"></div>
          <span className="text-[#0a662e] font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase">
            Government of Tamil Nadu
          </span>
          <div className="w-16 h-px bg-[#d4af37]"></div>
        </div>

        {/* English Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1b26] tracking-tight mb-3 text-center drop-shadow-[0_6px_12px_rgba(27,108,168,0.25)]">
          Salem District Administration Society
        </h1>

        {/* Tamil Title in Pill */}
        <div className="bg-[#e8f5e9] px-6 py-1.5 rounded-full mb-1 border border-[#c8e6c9]">
          <span className="text-[#0a662e] text-lg sm:text-xl font-bold">
            சேலம் மாவட்ட நிர்வாகச் சமூகம்
          </span>
        </div>
      </div>


    </header>
  );
}
