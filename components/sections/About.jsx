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

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isChangingChannel, setIsChangingChannel] = useState(false);

  // Lightning state
  const [lightning, setLightning] = useState(false);

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

  // Christmas lights message sequence - spells "ABHI"
  const [messageIndex, setMessageIndex] = useState(0);
  const messageSequence = [
    new Set([0]), // A
    new Set([1]), // B
    new Set([2]), // H
    new Set([3]), // I
    new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]), // All flash
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messageSequence.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Random lightning flashes
  useEffect(() => {
    const flashLightning = () => {
      setLightning(true);
      setTimeout(() => setLightning(false), 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        flashLightning();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-play carousel with channel change effect - 5 second interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setIsChangingChannel(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        setIsChangingChannel(false);
      }, 400); // Extended static duration
    }, 5000); //  second interval
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const changeChannel = (index) => {
    if (index === currentSlide) return;
    setIsChangingChannel(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsChangingChannel(false);
    }, 500); // Extended static duration
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen bg-black py-20 px-4 overflow-hidden"
    >
      {/* Mind Flayer Lightning Flash */}
      <AnimatePresence>
        {lightning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-purple-500/10 to-transparent pointer-events-none z-50"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.3), transparent 70%)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Upside Down Background with VHS noise */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-red-950/40" />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />

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

      {/* Christmas Lights 2.0 - Spelling "ABHI" */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-20 max-w-5xl mx-auto mb-2 mt-4"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          {Array.from({ length: 9 }).map((_, i) => {
            const isActive = messageSequence[messageIndex]?.has(i);
            return (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-amber-400 shadow-[0_0_20px_#fbbf24] scale-125"
                    : "bg-amber-900/30"
                }`}
                animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
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
                <span className="text-red-500 font-['VT323'] text-xl md:text-2xl tracking-widest uppercase">
                  → ABOUT
                </span>
              </div>
            </motion.div>

            {/* Glitch Title - ABHISARGA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-5xl md:text-6xl lg:text-8xl font-['Cinzel_Decorative'] font-black text-white relative tracking-tight">
                <span className="relative inline-block">
                  ABHISARGA
                  <span
                    className="absolute top-0 left-0 text-red-600 opacity-70 blur-md"
                    style={{ textShadow: "0 0 20px #dc2626, 0 0 40px #dc2626" }}
                  >
                    ABHISARGA
                  </span>
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
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60 blur-sm" />
            </motion.div>

            {/* Dossier Description */}
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
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed font-['Space_Grotesk']">
                    Abhisarga is IIIT Sri City's annual techno-cultural fest. It combines technology, culture, and entertainment, creating a vibrant platform for talent and innovation.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-amber-500 font-['VT323'] text-xl mt-1">▸</span>
                  <p className="text-gray-400 leading-relaxed font-['VT323'] text-base md:text-lg">
                    Experience dazzling dance competitions, proshows, DJ nights, technical challenges, cultural performances, and much more. Celebrate creativity and innovation at Abhisarga this March!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Possessed 1980s TV Set */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[600px] md:h-[700px] flex items-center justify-center"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Floating TV Set */}
            <motion.div
              className="relative"
              animate={{
                y: [0, -15, 0],
                rotateZ: [0, 1, -1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* TV Chassis - 1980s Style */}
              <div className="relative bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 p-8 md:p-10 rounded-lg shadow-2xl border-4 border-stone-600"
                style={{ width: "500px", height: "450px" }}
              >
                {/* Wood grain texture */}
                <div className="absolute inset-0 opacity-20 rounded-lg"
                  style={{
                    backgroundImage: `repeating-linear-gradient(90deg, #3e2723 0px, #5d4037 2px, #3e2723 4px)`,
                  }}
                />

                {/* Red vines wrapping around TV - Realistic Vecna corruption */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                  {/* SVG Filters for realistic vine effects */}
                  <defs>
                    {/* Slime/wetness filter */}
                    <filter id="slime">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 0.3 0 0 0  0 0 0.3 0 0  0 0 0 1 0" result="slime" />
                      <feBlend in="SourceGraphic" in2="slime" mode="normal" />
                    </filter>
                    
                    {/* Glow filter */}
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Left side vines - Multi-layered for 3D effect */}
                  {/* Base thick vine */}
                  <motion.path
                    d="M10,50 Q25,85 40,120 C45,145 50,170 55,195 Q60,230 65,265 T75,330"
                    stroke="#8b0000"
                    strokeWidth="10"
                    fill="none"
                    opacity="0.9"
                    filter="url(#slime)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M10,50 Q25,85 40,120 C45,145 50,170 55,195 Q60,230 65,265 T75,330",
                        "M10,50 Q35,95 40,120 C50,155 55,175 55,195 Q65,240 65,265 T85,330",
                        "M10,50 Q25,85 40,120 C45,145 50,170 55,195 Q60,230 65,265 T75,330"
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Highlight layer for 3D effect */}
                  <motion.path
                    d="M12,52 Q27,87 42,122 C47,147 52,172 57,197 Q62,232 67,267 T77,332"
                    stroke="#dc2626"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.8"
                    filter="url(#glow)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M12,52 Q27,87 42,122 C47,147 52,172 57,197 Q62,232 67,267 T77,332",
                        "M12,52 Q37,97 42,122 C52,157 57,177 57,197 Q67,242 67,267 T87,332",
                        "M12,52 Q27,87 42,122 C47,147 52,172 57,197 Q62,232 67,267 T77,332"
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Secondary left vine - thinner branch */}
                  <motion.path
                    d="M30,100 Q50,130 60,160 T70,220"
                    stroke="#8b0000"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.85"
                    filter="url(#slime)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M30,100 Q50,130 60,160 T70,220",
                        "M30,100 Q55,140 60,160 T80,220",
                        "M30,100 Q50,130 60,160 T70,220"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  />
                  
                  <motion.path
                    d="M32,102 Q52,132 62,162 T72,222"
                    stroke="#ef4444"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.7"
                    filter="url(#glow)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M32,102 Q52,132 62,162 T72,222",
                        "M32,102 Q57,142 62,162 T82,222",
                        "M32,102 Q52,132 62,162 T72,222"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  />

                  {/* Right side vines - Multi-layered */}
                  {/* Base thick vine */}
                  <motion.path
                    d="M490,50 Q475,85 460,120 C455,145 450,170 445,195 Q440,230 435,265 T425,330"
                    stroke="#8b0000"
                    strokeWidth="10"
                    fill="none"
                    opacity="0.9"
                    filter="url(#slime)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M490,50 Q475,85 460,120 C455,145 450,170 445,195 Q440,230 435,265 T425,330",
                        "M490,50 Q465,95 460,120 C450,155 445,175 445,195 Q435,240 435,265 T415,330",
                        "M490,50 Q475,85 460,120 C455,145 450,170 445,195 Q440,230 435,265 T425,330"
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                  />
                  
                  {/* Highlight layer */}
                  <motion.path
                    d="M488,52 Q473,87 458,122 C453,147 448,172 443,197 Q438,232 433,267 T423,332"
                    stroke="#dc2626"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.8"
                    filter="url(#glow)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M488,52 Q473,87 458,122 C453,147 448,172 443,197 Q438,232 433,267 T423,332",
                        "M488,52 Q463,97 458,122 C448,157 443,177 443,197 Q433,242 433,267 T413,332",
                        "M488,52 Q473,87 458,122 C453,147 448,172 443,197 Q438,232 433,267 T423,332"
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                  />

                  {/* Secondary right vine */}
                  <motion.path
                    d="M470,100 Q450,130 440,160 T430,220"
                    stroke="#8b0000"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.85"
                    filter="url(#slime)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M470,100 Q450,130 440,160 T430,220",
                        "M470,100 Q445,140 440,160 T420,220",
                        "M470,100 Q450,130 440,160 T430,220"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                  
                  <motion.path
                    d="M468,102 Q448,132 438,162 T428,222"
                    stroke="#ef4444"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.7"
                    filter="url(#glow)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M468,102 Q448,132 438,162 T428,222",
                        "M468,102 Q443,142 438,162 T418,222",
                        "M468,102 Q448,132 438,162 T428,222"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                  
                  {/* Top vines - wrapping across */}
                  {/* Base layer */}
                  <motion.path
                    d="M100,8 Q200,25 300,8 Q400,18 500,8"
                    stroke="#8b0000"
                    strokeWidth="8"
                    fill="none"
                    opacity="0.9"
                    filter="url(#slime)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M100,8 Q200,25 300,8 Q400,18 500,8",
                        "M100,8 Q200,35 300,8 Q400,28 500,8",
                        "M100,8 Q200,25 300,8 Q400,18 500,8"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  {/* Highlight layer */}
                  <motion.path
                    d="M102,10 Q202,27 302,10 Q402,20 498,10"
                    stroke="#dc2626"
                    strokeWidth="5"
                    fill="none"
                    opacity="0.8"
                    filter="url(#glow)"
                    strokeLinecap="round"
                    animate={{
                      d: [
                        "M102,10 Q202,27 302,10 Q402,20 498,10",
                        "M102,10 Q202,37 302,10 Q402,30 498,10",
                        "M102,10 Q202,27 302,10 Q402,20 498,10"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  {/* Small tendril details */}
                  {[
                    { x: 80, y: 150, angle: -20 },
                    { x: 420, y: 180, angle: 20 },
                    { x: 250, y: 30, angle: 0 }
                  ].map((tendril, idx) => (
                    <motion.g key={idx}>
                      <motion.path
                        d={`M${tendril.x},${tendril.y} q5,10 8,20 t5,15`}
                        stroke="#8b0000"
                        strokeWidth="3"
                        fill="none"
                        opacity="0.7"
                        filter="url(#slime)"
                        strokeLinecap="round"
                        animate={{
                          rotate: [tendril.angle - 5, tendril.angle + 5, tendril.angle - 5]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
                      />
                      <motion.path
                        d={`M${tendril.x + 1},${tendril.y + 1} q5,10 8,20 t5,15`}
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.6"
                        filter="url(#glow)"
                        strokeLinecap="round"
                        animate={{
                          rotate: [tendril.angle - 5, tendril.angle + 5, tendril.angle - 5]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
                      />
                    </motion.g>
                  ))}
                </svg>

                {/* Pulsing eerie glow from Upside Down */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-40 blur-2xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      '0 0 30px #dc2626, inset 0 0 40px #dc2626',
                      '0 0 50px #dc2626, inset 0 0 60px #dc2626',
                      '0 0 30px #dc2626, inset 0 0 40px #dc2626',
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />

                {/* TV Screen Area */}
                <div className="relative w-full h-full bg-black rounded border-4 border-gray-900 overflow-hidden">
                  {/* Enhanced Static/White Noise with Vertical Roll during channel change */}
                  <AnimatePresence>
                    {isChangingChannel && (
                      <>
                        {/* White flash at start */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.8, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="absolute inset-0 bg-white z-40"
                        />
                        
                        {/* Realistic TV Static */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                          className="absolute inset-0 z-30 animate-v-roll"
                        >
                          {/* Multiple layers of static for depth */}
                          <div 
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='5' seed='1' /%3E%3CfeColorMatrix type='saturate' values='0' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1' /%3E%3C/svg%3E")`,
                              backgroundSize: '100px 100px',
                              animation: 'static-noise 0.1s steps(2) infinite'
                            }}
                          />
                          
                          {/* Second layer with different frequency */}
                          <div 
                            className="absolute inset-0 opacity-70"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.2' numOctaves='3' seed='2' /%3E%3CfeColorMatrix type='saturate' values='0' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)' /%3E%3C/svg%3E")`,
                              backgroundSize: '80px 80px',
                              animation: 'static-noise 0.15s steps(3) infinite reverse'
                            }}
                          />

                          {/* Horizontal scan lines during static */}
                          <div className="absolute inset-0" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px)',
                          }} />
                          
                          {/* Random white flicker bars */}
                          <motion.div
                            className="absolute inset-x-0 h-8 bg-white opacity-70"
                            animate={{
                              top: ['0%', '100%', '0%'],
                              opacity: [0.7, 0.3, 0.7]
                            }}
                            transition={{ duration: 0.3, repeat: 2 }}
                          />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Current Image */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide}
                      src={carouselImages[currentSlide].src}
                      alt={carouselImages[currentSlide].caption}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>

                  {/* VCR Green OSD Caption */}
                  <motion.div
                    className="absolute top-6 left-6 z-20 bg-black/70 px-4 py-2 border border-green-500/50"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="text-green-400 font-['VT323'] text-xl tracking-wider"
                      style={{ textShadow: '0 0 10px #22c55e' }}
                    >
                      ▶ {carouselImages[currentSlide].caption.toUpperCase()}
                    </p>
                  </motion.div>

                  {/* Scanlines effect */}
                  <div className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.3) 1px, transparent 2px)',
                    }}
                  />

                  {/* VHS distortion */}
                  <motion.div
                    className="absolute inset-0 bg-red-600/5 mix-blend-overlay pointer-events-none"
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                {/* TV Control Knobs */}
                <div className="absolute bottom-6 right-6 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-600 border-4 border-stone-700 shadow-inner" />
                  <div className="w-12 h-12 rounded-full bg-stone-600 border-4 border-stone-700 shadow-inner" />
                </div>

                {/* Brand label */}
                <div className="absolute top-4 right-6 text-stone-500 font-['VT323'] text-sm opacity-60">
                  ABHISARGA-VISION
                </div>
              </div>

              {/* Channel dots indicator */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3">
                {carouselImages.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => changeChannel(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? 'bg-red-500 shadow-[0_0_15px_#ef4444] scale-125'
                        : 'bg-stone-700 hover:bg-stone-600'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* The Rift Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="my-20 md:my-32 relative h-2"
        >
          <svg className="w-full h-16" viewBox="0 0 1000 50" preserveAspectRatio="none">
            <motion.path
              d="M0,25 Q100,10 200,25 T400,25 T600,25 T800,25 T1000,25"
              stroke="#dc2626"
              strokeWidth="3"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 10px #dc2626) drop-shadow(0 0 20px #dc2626)' }}
              animate={{
                d: [
                  "M0,25 Q100,10 200,25 T400,25 T600,25 T800,25 T1000,25",
                  "M0,25 Q100,40 200,25 T400,25 T600,25 T800,25 T1000,25",
                  "M0,25 Q100,10 200,25 T400,25 T600,25 T800,25 T1000,25"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M200,20 L210,30 L200,25 M400,20 L410,30 L400,25 M600,20 L610,30 L600,25 M800,20 L810,30 L800,25"
              stroke="#dc2626"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </svg>
        </motion.div>
                
        {/* Bottom Section - IIIT Sri City (Single Line) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-32 text-center mx-auto"
        >
          <div className="inline-block text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              
            </motion.div>

            <h3 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-['Cinzel_Decorative'] font-black text-white mt-4 mb-6 relative mx-auto whitespace-nowrap">
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

            <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto font-['Space_Grotesk'] text-base md:text-lg px-4">
              IIIT Sri City, established in 2013, is one of India's premier institutions for
              Information Technology education, research, and innovation. With state-of-the-art
              infrastructure and a vibrant campus culture, it nurtures future leaders in technology.
            </p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes glitch-skew {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes static-noise {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(2%, 1%); }
          30% { transform: translate(-1%, 2%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(2%, -2%); }
          70% { transform: translate(-1%, -1%); }
          80% { transform: translate(1%, 2%); }
          90% { transform: translate(-2%, -1%); }
          100% { transform: translate(0, 0); }
        }

        @keyframes v-roll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }

        .animate-v-roll {
          animation: v-roll 0.5s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default About;