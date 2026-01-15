"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const About = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sample images - replace with your actual event images
  const carouselImages = [
    "Abhisarga26/public/event1.png",
    "Abhisarga26/public/event2.png", 
    "Abhisarga26/public/event3.png",
    "Abhisarga26/public/event4.png",
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setIsAutoPlaying(false);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen bg-black py-20 px-4 overflow-hidden"
    >
      {/* Upside Down Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-black to-purple-950/30" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-40 mix-blend-overlay" />
      </div>

      {/* Animated Portal Rings */}
      <motion.div
        style={{ opacity }}
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full border-2 border-red-600/20 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-amber-500 font-['VT323'] text-xl tracking-wider uppercase">
                → About
              </span>
            </motion.div>

            {/* Glitch Title - ABHISARGA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-5xl md:text-7xl font-['Cinzel_Decorative'] font-bold text-white relative">
                <span className="relative inline-block">
                  ABHISARGA
                  {/* Glitch layers */}
                  <span className="absolute top-0 left-0 text-red-600 opacity-70 animate-glitch-1">
                    ABHISARGA
                  </span>
                  <span className="absolute top-0 left-0 text-cyan-600 opacity-70 animate-glitch-2">
                    ABHISARGA
                  </span>
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-gray-300 text-lg leading-relaxed font-['Space_Grotesk']">
                Abhisarga is IIIT Sri City's annual techno-cultural fest. It combines technology,
                culture, and entertainment, creating a vibrant platform for talent and innovation.
              </p>
              <p className="text-gray-400 leading-relaxed font-['Space_Grotesk']">
                Experience dazzling dance competitions, proshows, DJ nights, technical challenges,
                cultural performances, and much more. Celebrate creativity and innovation at
                Abhisarga this March!
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-6 pt-4"
            >
              {[
                { number: "10K+", label: "Participants" },
                { number: "50+", label: "Events" },
                { number: "3", label: "Days" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className="text-3xl font-bold text-red-500 font-['VT323'] group-hover:text-red-400 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide font-['Space_Grotesk']">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[600px] flex items-center justify-center perspective-1000"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Carousel Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {carouselImages.map((img, idx) => {
                const offset = (idx - currentSlide + carouselImages.length) % carouselImages.length;
                const isActive = offset === 0;
                
                return (
                  <motion.div
                    key={idx}
                    className="absolute w-[400px] h-[300px] rounded-lg overflow-hidden border-2 border-red-900/40 shadow-2xl cursor-pointer"
                    style={{
                      zIndex: carouselImages.length - Math.abs(offset),
                    }}
                    initial={false}
                    animate={{
                      x: offset * 60,
                      y: offset * 40,
                      rotateY: offset * 15,
                      rotateZ: offset * -5,
                      scale: isActive ? 1 : 0.85 - Math.abs(offset) * 0.1,
                      opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onClick={() => setCurrentSlide(idx)}
                  >
                    {/* Placeholder with gradient - replace with actual images */}
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-red-900 to-black flex items-center justify-center">
                      <span className="text-white text-xl font-['VT323']">
                        Event Photo {idx + 1}
                      </span>
                    </div>
                    
                    {/* Glitch overlay effect */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-red-600/10 mix-blend-overlay"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-red-900/50 border border-red-500/50 text-white hover:bg-red-800/70 transition-all backdrop-blur-sm"
              >
                ←
              </button>
              <div className="flex items-center gap-2">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide
                        ? "w-8 bg-red-500"
                        : "w-2 bg-red-900/50 hover:bg-red-700/70"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-red-900/50 border border-red-500/50 text-white hover:bg-red-800/70 transition-all backdrop-blur-sm"
              >
                →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - IIIT Sri City */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24 text-right"
        >
          <div className="inline-block text-right">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-amber-500 font-['VT323'] text-xl tracking-wider uppercase">
                → About
              </span>
            </motion.div>
            
            <h3 className="text-4xl md:text-6xl font-['Cinzel_Decorative'] font-bold text-white mt-4 mb-6">
              IIIT SRI CITY
            </h3>
            
            <p className="text-gray-300 leading-relaxed max-w-2xl ml-auto font-['Space_Grotesk']">
              IIIT Sri City, established in 2013, is one of India's premier institutions for
              Information Technology education, research, and innovation. With state-of-the-art
              infrastructure and a vibrant campus culture, it nurtures future leaders in technology.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Custom Glitch Animation Styles */}
      <style jsx>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        .animate-glitch-1 {
          animation: glitch-1 0.3s infinite;
        }
        
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite reverse;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default About;