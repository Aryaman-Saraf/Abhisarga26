"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const About = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Event images from public/images directory
  const carouselImages = [
    { src: "/images/event1.jpg", caption: "Dance Night" },
    { src: "/images/event2.jpg", caption: "Tech Fest" },
    { src: "/images/event3.jpg", caption: "Cultural Show" },
    { src: "/images/event4.jpg", caption: "Pro Show" },
  ];

  // Floating spores particles
  const spores = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 10 + Math.random() * 20,
    delay: 5,
  }));

  // Christmas lights blinking effect
  const [activeLights, setActiveLights] = useState(new Set([0, 2, 5, 7]));

  useEffect(() => {
    const interval = setInterval(() => {
      const newActive = new Set();
      const count = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        newActive.add(Math.floor(Math.random() * 9));
      }
      setActiveLights(newActive);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen bg-black py-20 px-4 overflow-hidden"
    >
      {/* Upside Down Background with VHS noise */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-red-950/40" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay animate-pulse" />

        {/* Floating Spores Effect */}
        {spores.map((spore) => (
          <motion.div
            key={spore.id}
            className="absolute w-1 h-1 bg-white/40 rounded-full blur-sm"
            initial={{ x: `${spore.x}vw`, y: `${spore.y}vh` }}
            animate={{
              y: [`${spore.y}vh`, `${spore.y + 20}vh`, `${spore.y}vh`],
              x: [`${spore.x}vw`, `${spore.x + 5}vw`, `${spore.x}vw`],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: spore.duration,
              delay: spore.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Joyce Byers Christmas Lights Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-20 max-w-5xl mx-auto mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeLights.has(i)
                  ? "bg-amber-400 shadow-[0_0_20px_#fbbf24] scale-125"
                  : "bg-amber-900/30"
                }`}
              animate={activeLights.has(i) ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Hawkins Lab Dossier Style */}
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Classified Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <div className="border-2 border-red-600/50 bg-red-950/20 px-4 py-2 backdrop-blur-sm">
                <span className="text-red-500 font-['VT323'] text-2xl tracking-widest uppercase">
                  → ABOUT
                </span>
              </div>
            </motion.div>

            {/* Glitch Title - ABHISARGA with Stranger Things style */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-6xl md:text-8xl font-['Cinzel_Decorative'] font-black text-white relative tracking-tight">
                <span className="relative inline-block">
                  ABHISARGA
                  {/* Red neon glow effect */}
                  <span
                    className="absolute top-0 left-0 text-red-600 opacity-70 blur-md"
                    style={{ textShadow: "0 0 20px #dc2626, 0 0 40px #dc2626" }}
                  >
                    ABHISARGA
                  </span>
                  {/* Cyan glitch layer */}
                  <span
                    className="absolute top-0 left-0 text-cyan-500 opacity-50"
                    style={{
                      animation: "glitch-skew 0.3s infinite",
                      clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)"
                    }}
                  >
                    ABHISARGA
                  </span>
                </span>
              </h2>

              {/* Red underglow */}
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60 blur-sm" />
            </motion.div>

            {/* Dossier Description with typewriter feel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6 border-l-2 border-amber-500/30 pl-6"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 font-['VT323'] text-xl mt-1">▸</span>
                  <p className="text-gray-300 text-lg leading-relaxed font-['Space_Grotesk']">
                    <span className="text-amber-500 font-semibold"></span> Abhisarga is IIIT Sri City's annual techno-cultural fest. It combines technology, culture, and entertainment, creating a vibrant platform for talent and innovation.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-amber-500 font-['VT323'] text-xl mt-1">▸</span>
                  <p className="text-gray-400 leading-relaxed font-['VT323'] text-lg">
                    <span className="text-red-400 font-semibold"></span> Experience dazzling dance competitions, proshows, DJ nights, technical challenges, cultural performances, and much more. Celebrate creativity and innovation at Abhisarga this March!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Floating Polaroids (Upside Down Memories) - ENLARGED */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[700px] flex items-center justify-center"
            style={{ perspective: "1500px" }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Polaroid Stack */}
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {carouselImages.map((img, idx) => {
                  const offset = (idx - currentSlide + carouselImages.length) % carouselImages.length;
                  const isActive = offset === 0;

                  return (
                    <motion.div
                      key={idx}
                      className="absolute cursor-pointer"
                      style={{
                        zIndex: carouselImages.length - Math.abs(offset),
                      }}
                      initial={false}
                      animate={{
                        x: offset * 80,
                        y: offset * 60,
                        rotateY: offset * 20,
                        rotateZ: offset * -8,
                        scale: isActive ? 1 : 0.75 - Math.abs(offset) * 0.12,
                        opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3,
                      }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      onClick={() => setCurrentSlide(idx)}
                      whileHover={isActive ? { scale: 1.05, rotateZ: 2 } : {}}
                    >
                      {/* Polaroid Frame - INCREASED SIZE */}
                      <div className="bg-white p-4 pb-16 shadow-2xl" style={{ width: "450px" }}>
                        {/* Photo Area - INCREASED HEIGHT */}
                        <div className="w-full h-96 bg-gradient-to-br from-purple-900 via-red-900 to-black overflow-hidden relative">

                          {/* Image */}
                          <img
                            src={img.src}
                            alt={img.caption}
                            className="absolute inset-0 w-full h-full object-cover"
                          />

                          {/* VHS distortion effects */}
                          {isActive && (
                            <>
                              <motion.div
                                className="absolute inset-0 bg-red-600/10 mix-blend-overlay"
                                animate={{ opacity: [0, 0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" />
                            </>
                          )}
                        </div>

                        {/* Polaroid Caption */}
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                          <p className="text-gray-800 font-['VT323'] text-2xl">
                            {img.caption}
                          </p>
                        </div>
                      </div>

                      {/* Tape effect on corners */}
                      <div className="absolute -top-2 left-10 w-20 h-7 bg-amber-100/80 rotate-[-5deg] shadow-md" />
                      <div className="absolute -top-2 right-10 w-20 h-7 bg-amber-100/80 rotate-[5deg] shadow-md" />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
                
        {/* Bottom Section - IIIT Sri City (Real World) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-32 text-right"
        >
          <div className="inline-block text-right border-r-2 border-amber-500/30 pr-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block border-2 border-amber-600/50 bg-amber-950/20 px-4 py-2 backdrop-blur-sm mb-6">
                <span className="text-amber-500 font-['VT323'] text-2xl tracking-widest uppercase">
                  → INSTITUTE
                </span>
              </div>
            </motion.div>

            <h3 className="text-5xl md:text-7xl font-['Cinzel_Decorative'] font-black text-white mt-4 mb-6 relative">
              <span className="relative inline-block">
                IIIT SRI CITY
                <span
                  className="absolute top-0 left-0 text-amber-600/50 blur-lg"
                  style={{ textShadow: "0 0 30px #d97706" }}
                >
                  IIIT SRI CITY
                </span>
              </span>
            </h3>

            <p className="text-gray-300 leading-relaxed max-w-2xl ml-auto font-['Space_Grotesk'] text-lg">
              IIIT Sri City, established in 2013, is one of India's premier institutions for
              Information Technology education, research, and innovation. With state-of-the-art
              infrastructure and a vibrant campus culture, it nurtures future leaders in technology.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Custom Glitch Animation Styles */}
      <style jsx>{`
        @keyframes glitch-skew {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </section>
  );
};

export default About;