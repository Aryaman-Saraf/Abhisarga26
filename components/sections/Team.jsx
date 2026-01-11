'use client';

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue
} from "framer-motion";

import TeamCard from "../TeamCard";
import { teamCategories } from "../../lib/content";

export default function TeamPage() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [videoDone, setVideoDone] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && !videoDone) {
          document.documentElement.style.overflow = "hidden";
          document.body.style.overflow = "hidden";
          sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [videoDone]);

  useEffect(() => {
    if (videoDone) {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    }
  }, [videoDone]);

  const mouseX = useMotionValue(-500); 
  const mouseY = useMotionValue(-500);
  const fogX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const fogY = useSpring(mouseY, { stiffness: 40, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 225); 
      mouseY.set(e.clientY - 225);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const bgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.8]), { stiffness: 30, damping: 20 });
  const exploreOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    if (isInView && !videoDone) {
      const t = setTimeout(() => setShowSkip(true), 1500);
      return () => clearTimeout(t);
    }
  }, [isInView, videoDone]);

  const getRowsForCategory = (members, catIdx) => {
    let result = [];
    let mCopy = [...members];
    if (catIdx === 0) {
      // 1-2-2 Pattern for desktop
      if (mCopy.length > 0) result.push(mCopy.splice(0, 1)); 
      while (mCopy.length > 0) {
        result.push(mCopy.splice(0, 2)); 
      }
    } else {
      // 3-2-3-2 Pattern for desktop
      let step = 0;
      while (mCopy.length > 0) {
        let size = (step % 2 === 0) ? 3 : 2;
        result.push(mCopy.splice(0, size));
        step++;
      }
    }
    return result;
  };

  return (
    <div ref={sectionRef} className="relative w-full bg-black" style={{ minHeight: "550vh" }}>
      
      <AnimatePresence>
        {!videoDone && isInView && (
          <motion.div
            key="video-blocker"
            className="fixed inset-0 z-[200] bg-black"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
          >
            <video
              ref={videoRef}
              src="/video/intro_video_team.mp4"
              autoPlay muted playsInline preload="auto" 
              onEnded={() => setVideoDone(true)}
              className="w-full h-full object-cover"
            />
            {showSkip && (
              <motion.button
                onClick={() => setVideoDone(true)}
                className="absolute bottom-12 right-6 z-[210] flex items-center gap-4 bg-transparent cursor-pointer"
              >
                <span className="text-[#ff0000] text-[14px] tracking-[0.6em] font-black uppercase drop-shadow-[0_0_12px_#ff0000]">Skip Cinematic</span>
                <div className="w-10 h-[2px] bg-[#ff0000] shadow-[0_0_15px_#ff0000]" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <AnimatePresence>
          {videoDone && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ x: fogX, y: fogY, position: 'fixed', top: 0, left: 0, zIndex: 10, pointerEvents: 'none' }}
              className="w-[450px] h-[450px]"
            >
              <div className="absolute inset-0 bg-[#ff0000]/25 blur-[100px] rounded-full mix-blend-screen" />
              <div className="absolute inset-[150px] bg-[#ff0000]/40 blur-[40px] rounded-full mix-blend-plus-lighter" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/team/background_team.png')`, scale: bgScale, opacity: videoDone ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-black/25 z-[5]" />

        <AnimatePresence>
          {videoDone && (
            <motion.div style={{ opacity: exploreOpacity }} className="absolute inset-0 z-[20] flex flex-col items-center justify-center px-4">
              <div className="relative flex flex-col items-center">
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "200px", opacity: [0, 1, 0.5, 1] }}
                  transition={{ width: { duration: 1.5, ease: "easeOut" }, opacity: { duration: 2, repeat: Infinity } }}
                  className="absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent shadow-[0_0_15px_#ff0000]"
                />
                <span className="relative z-10 text-[#ffffff] text-[12px] md:text-[16px] tracking-[0.6em] md:tracking-[1.2em] font-black uppercase text-center drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
                  Scroll to Explore
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="relative z-30 max-w-[1400px] mx-auto px-5 flex flex-col items-center"
        style={{ marginTop: "-100vh" }} 
        animate={videoDone ? { opacity: 1 } : { opacity: 0 }}
      >
        {videoDone && (
          <>
            <div className="h-[120vh] w-full" />
            {teamCategories.map((cat, catIdx) => {
              const rows = getRowsForCategory(cat.members, catIdx);
              return (
                <div key={catIdx} className="w-full mb-[150px] md:mb-[400px] flex flex-col items-center">
                  <h2 className="text-white uppercase font-serif font-black text-center px-4 leading-[1.1] w-full text-[clamp(1.8rem,6vw,4.5rem)] tracking-[0.15em] md:tracking-[0.4em] mb-[60px] md:mb-[150px]">
                    {cat.category}
                  </h2>

                  {/* Responsive Row Container */}
                  <div className="flex flex-col gap-[80px] md:gap-[250px] w-full items-center">
                    {rows.map((rowItems, rowIndex) => (
                      <div 
                        key={rowIndex} 
                        className={`flex flex-col min-[900px]:flex-row items-center justify-center w-full 
                          ${rowItems.length === 3 ? "gap-[40px] md:gap-[60px]" : "gap-[80px] min-[900px]:gap-[150px]"}`}
                      >
                        {rowItems.map((m, idx) => (
                          <div key={idx} className="w-[220px] md:w-[300px] flex justify-center">
                            <TeamCard {...m} photoUrl={m.image} frameUrl="/team/frame_team.png" socials={m.socials} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="h-[50vh]" />
          </>
        )}
      </motion.div>
    </div>
  );
}