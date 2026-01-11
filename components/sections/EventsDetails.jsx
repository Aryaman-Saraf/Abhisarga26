"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EventDetails({ event }) {
  const router = useRouter();
  const [phase, setPhase] = useState("initial");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("vines"), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => setPhase("upside-down");

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden flex flex-col items-center justify-center font-serif py-10 md:py-0">

      {(phase === "vines" || phase === "upside-down") && (
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="fixed inset-0 w-full h-full object-cover z-20 pointer-events-none"
          style={{ filter: "brightness(0.6) contrast(1.3)" }}
        >
          <source src="/veins-video.mp4" type="video/mp4" />
        </video>
      )}

      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-[2000ms] z-10
        ${phase === "upside-down" ? "opacity-40" : "opacity-0"}
        bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]`}
      />

      <div className="relative z-30 text-center px-4 sm:px-6 w-full max-w-5xl mx-auto">
        <h1
          className={`
            text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter transition-all duration-[1500ms]
            ${phase !== "initial" ? "text-red-600 animate-stranger-glow" : "text-white"}
            ${phase === "upside-down" ? "animate-flicker" : ""}
          `}
          style={{ fontFamily: '"ITC Benguiat", serif', lineHeight: '0.9' }}
        >
          {event.name}
        </h1>

        {/* METADATA SECTION: Grid used for better mobile alignment */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-white/10 py-6">
          <div className="text-center">
            <p className="text-[12px] md:text-[15px] text-gray-500 tracking-[0.3em] uppercase">Date</p>
            <p className="text-white font-bold tracking-widest text-sm md:text-base">{event.date || "TBA"}</p>
          </div>
          <div className="text-center">
            <p className="text-[12px] md:text-[15px] text-gray-500 tracking-[0.3em] uppercase">Location</p>
            <p className="text-white font-bold tracking-widest text-sm md:text-base">{event.location || "TBA"}</p>
          </div>
          <div className="text-center">
            <p className="text-[12px] md:text-[15px] text-gray-500 tracking-[0.3em] uppercase">Club</p>
            <p className="text-white font-bold tracking-widest text-sm md:text-base">{event.club || "TBA"}</p>
          </div>
        </div>

        <div className="mt-8 px-2">
          <p className="text-white tracking-[0.05em] md:tracking-[0.1em] font-medium text-base md:text-xl leading-relaxed max-w-3xl mx-auto opacity-90">
            {event.description || "The Gate is Opening"}
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          <button className="w-full sm:w-auto px-10 py-4 cursor-pointer bg-red-700 text-white font-bold tracking-[0.3em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(185,28,28,0.4)] hover:bg-red-600 hover:scale-105 hover:shadow-[0_0_35px_rgba(220,38,38,0.7)] active:scale-95">
            Register
          </button>

          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-4 border cursor-pointer border-red-900 text-red-700 transition-all duration-300 tracking-widest uppercase text-sm hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 hover:shadow-[inset_0_0_10px_rgba(239,68,68,0.2)] active:scale-95"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes stranger-glow {
          0%, 100% { text-shadow: 0 0 10px #7f1d1d, 0 0 20px #7f1d1d; }
          50% { text-shadow: 0 0 20px #dc2626, 0 0 40px #7f1d1d, 0 0 60px #450a0a; }
        }

        @keyframes flicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            opacity: 1;
            text-shadow: 0 0 20px #dc2626, 0 0 40px #7f1d1d;
          }
          20%, 24%, 55% {
            opacity: 0.7;
            text-shadow: none;
          }
        }

        .animate-stranger-glow {
          animation: stranger-glow 3s ease-in-out infinite;
        }

        .animate-flicker {
          animation: flicker 4s linear infinite;
        }
      `}</style>
    </div>
  );
}