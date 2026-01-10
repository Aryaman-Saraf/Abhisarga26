"use client";


import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";


export default function Events() {
  const containerRef = useRef(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  
  const imgTopY = useTransform(smoothProgress, [0, 0.15], ["-100%", "0%"]);
  const imgBottomY = useTransform(smoothProgress, [0, 0.15], ["100%", "0%"]);
  const floatOdd = useTransform(smoothProgress, [0.15, 0.5], [0, -100]);
  const floatEven = useTransform(smoothProgress, [0.15, 0.5], [0, 100]);
  const energyGlow = useTransform(smoothProgress, [0.2, 0.45, 0.6], [
    "0px 0px 0px rgba(239,68,68,0)", 
    "0px 0px 70px 25px rgba(239,68,68,0.9), inset 0px 0px 30px rgba(239,68,68,0.6)", 
    "0px 0px 0px rgba(239,68,68,0)"
  ]);
  const borderColor = useTransform(smoothProgress, [0.2, 0.45, 0.6], 
    ["rgba(255,255,255,0.1)", "rgba(239,68,68,1)", "rgba(239,68,68,0)"]
  );
  const imageOpacity = useTransform(smoothProgress, [0.5, 0.65], [1, 0]);
  const imageScale = useTransform(smoothProgress, [0.45, 0.65], [1, 1.4]); 
  const dissolveBlur = useTransform(smoothProgress, [0.5, 0.65], ["blur(0px)", "blur(50px)"]);
  const contentOpacity = useTransform(smoothProgress, [0.65, 0.8], [0, 1]);
  const contentScale = useTransform(smoothProgress, [0.75, 0.95], [0.7, 1]);

  const eventImages = ["/img1(e).jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"];

  const handleJoinHunt = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/events-explore");
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div  id="events" ref={containerRef} className="relative bg-black" style={{ height: "450vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-4 z-10 gap-8 p-12 pointer-events-none">
          {eventImages.map((src, i) => (
            <motion.div
              key={i}
              style={{ opacity: imageOpacity, scale: imageScale, filter: dissolveBlur, y: i % 2 === 0 ? imgTopY : imgBottomY }}
              className="w-full h-full relative"
            >
              <motion.div 
                style={{ y: i % 2 === 0 ? floatOdd : floatEven, boxShadow: energyGlow, borderColor: borderColor }}
                className="w-full h-full border-[3px] rounded-sm overflow-hidden relative transition-all duration-150"
              >
                <img src={src} className="w-full h-full object-cover" alt="event" />
                <motion.div 
                  style={{ opacity: useTransform(smoothProgress, [0.25, 0.5], [0, 0.7]) }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ff0000_0%,_transparent_80%)] mix-blend-color-dodge" 
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        
        <motion.div style={{ opacity: contentOpacity }} className="absolute inset-0 z-20 pointer-events-none">
          <video
            autoPlay loop muted playsInline
            className="w-[105vw] h-[93vh] object-cover brightness-[0.7] contrast-125"
          >
            <source src="/eventVideo.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
        </motion.div>

        
        <motion.div 
          style={{ opacity: contentOpacity, zIndex: 50 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <motion.div 
            style={{ scale: contentScale }} 
            className="relative flex flex-col items-start justify-center text-center px-8 py-4 z-50"
          >
            <h1 className="text-7xl md:text-[13rem] mt-[-50vh] font-bold text-red-700 tracking-tighter stranger-title animate-flicker">
              EVENTS
            </h1>
            
            <p className="text-white ml-[20vw] drop-shadow-[0_2px_10px_rgba(0,0,0,1)] tracking-[1em] text-xs md:text-lg uppercase font-bold mt-[-10px] opacity-90">
              The veil is thinning
            </p>
            
            <button 
              onClick={handleJoinHunt}
              className="mt-10  ml-[10vw] group relative inline-flex items-center justify-center px-16 py-5 font-black text-white border-2 border-red-600 bg-red-600/10 backdrop-blur-md hover:bg-red-700 hover:border-red-700 transition-all duration-300 shadow-[0_0_50px_rgba(220,38,38,0.5)] uppercase tracking-[0.3em] cursor-pointer"
            >
              Join the Hunt
              <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </motion.div>
        </motion.div>

      </div>

      <style>{`
        .stranger-title {
          font-family: serif;
          text-shadow: 0 0 20px #ff0000, 0 0 50px #990000, 4px 4px 30px #000, -2px -2px 10px #000;
        }
        @keyframes flicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; filter: drop-shadow(0 0 10px red); }
          20%, 24%, 55% { opacity: 0.4; text-shadow: none; }
        }
        .animate-flicker {
          animation: flicker 4s linear infinite;
        }
      `}</style>
    </div>
  );
}