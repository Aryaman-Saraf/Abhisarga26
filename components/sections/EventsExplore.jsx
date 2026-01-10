"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { eventCategories } from "../../lib/content";

gsap.registerPlugin(ScrollTrigger);

const ALL_EVENTS = eventCategories.flatMap((cat) =>
  cat.events.map((event) => ({
    ...event,
    category: cat.category,
    img: event.img || "/dummy-poster.png",
  }))
);

const pairedEvents = [];
for (let i = 0; i < ALL_EVENTS.length; i += 2) {
  pairedEvents.push(ALL_EVENTS.slice(i, i + 2));
}

function EventCard({ event }) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleKnowMore = (e) => {
    if (e) e.stopPropagation();
    const slug = event.name.replace(/\s+/g, "-").toLowerCase();
    router.push(`/events/${slug}`);
  };

  return (
    <div
      className="relative w-full h-full cursor-pointer group"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Added touch support for mobile
      onTouchStart={() => setIsHovered(true)}
      onClick={() => {
        if (isHovered) handleKnowMore();
      }}
    >
      <div
        className={`absolute -inset-4 bg-red-600/10 rounded-full blur-3xl transition-opacity duration-700 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: isHovered ? 75 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div
          className={`absolute inset-0 bg-zinc-900 rounded-xl overflow-hidden transition-all duration-500 border-2 
  ${
    isHovered
      ? "border-white/10 shadow-none"
      : "border-red-500 shadow-[0_0_25px_rgba(220,38,38,0.6),_inset_0_0_15px_rgba(220,38,38,0.5)]"
  }`}
        >
          <img
            src={event.img}
            alt={event.name}
            onError={(e) => {
              e.target.src = "/dummy-poster.png";
            }}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered
                ? "opacity-20 scale-110 blur-sm"
                : "opacity-100 scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Hover Content Overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
          initial={{ opacity: 0, z: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            z: isHovered ? 180 : 0,
            y: isHovered ? -120 : 0,
            rotateX: isHovered ? -75 : 0,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ transformStyle: "preserve-3d", pointerEvents: isHovered ? "auto" : "none" }}
        >
          <h4 className="text-4xl md:text-5xl font-black uppercase text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] leading-tight">
            {event.name}
          </h4>

          <div className="h-[2px] w-16 bg-red-500 my-4 shadow-[0_0_10px_#ef4444]" />

          {/* UPDATED TEXT SIZES HERE */}
          <div className="flex flex-col gap-2 text-lg md:text-2xl font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
            <p>
              DATE:{" "}
              <span className="text-white ml-2">{event.date || "TBA"}</span>
            </p>
            <p>
              LOCATION:{" "}
              <span className="text-white ml-2">{event.location || "TBA"}</span>
            </p>
            <p>
              CLUB:{" "}
              <span className="text-white ml-2">{event.club || "TBA"}</span>
            </p>
          </div>

          <button
            onClick={handleKnowMore}
            className="pointer-events-auto px-6 py-2 bg-red-600 text-white font-bold tracking-widest hover:bg-white hover:text-black transition-colors duration-300 rounded-sm text-[10px]"
          >
            KNOW MORE
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function DeepForestParallax() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const treesRef = useRef(null);
  const treesRef2 = useRef(null);
  const treesRef3 = useRef(null);
  const rowRefs = useRef([]);
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const lightningLeftRef = useRef(null);
  const lightningRightRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx_canvas = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 90 + 50;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.opacity = 0.8;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.005;
        if (this.size > 0) this.size += 0.2;
      }
      draw() {
        const gradient = ctx_canvas.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, `rgba(255, 0, 0, ${this.opacity})`);
        gradient.addColorStop(0.3, `rgba(180, 0, 0, ${this.opacity * 0.8})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx_canvas.fillStyle = gradient;
        ctx_canvas.beginPath();
        ctx_canvas.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx_canvas.fill();
      }
    }

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.current.x, mouse.current.y));
      }
    };

    const animateFog = () => {
      ctx_canvas.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].opacity <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      animationFrameId = requestAnimationFrame(animateFog);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    animateFog();

    const triggerLightning = () => {
      const isLeft = Math.random() > 0.5;
      const target = isLeft
        ? lightningLeftRef.current
        : lightningRightRef.current;
      if (!target) return;

      const tl = gsap.timeline();
      tl.to(target, { opacity: 0.7, duration: 0.05 })
        .to(target, { opacity: 0.2, duration: 0.05 })
        .to(target, { opacity: 0.8, duration: 0.1 })
        .to(target, { opacity: 0, duration: 0.4, ease: "power2.out" });

      setTimeout(triggerLightning, Math.random() * 4000 + 3000);
    };
    const lightningTimeout = setTimeout(triggerLightning, 2000);

    let ctx = gsap.context(() => {
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      mainTl
        .to(
          treesRef.current,
          {
            scale: 4,
            opacity: 0,
            filter: "blur(20px)",
            duration: 0.8,
            ease: "none",
          },
          0
        )
        .to(treesRef2.current, { scale: 3, duration: 1.2, ease: "none" }, 0)
        .to(
          treesRef2.current,
          { opacity: 0, filter: "blur(15px)", duration: 0.8 },
          1.5
        )
        .to(treesRef3.current, { scale: 2.5, duration: 1.8, ease: "none" }, 0)
        .to(
          treesRef3.current,
          { opacity: 0, scale: 4, filter: "blur(15px)", duration: 0.5 },
          1.7
        )
        .to(bgRef.current, { scale: 1.3, duration: 2.0, ease: "none" }, 0);

      rowRefs.current.forEach((row) => {
        if (!row) return;
        const cards = row.querySelectorAll(".mission-card-gsap-wrapper");
        cards.forEach((card, i) => {
          const isLeft = i % 2 === 0;
          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: isLeft ? -800 : 800,
              rotate: isLeft ? -15 : 15,
              filter: "blur(20px)",
            },
            {
              opacity: 1,
              x: 0,
              rotate: 0,
              filter: "blur(0px)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                end: "top 35%",
                scrub: 1.2,
              },
            }
          );
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      clearTimeout(lightningTimeout);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-black text-white min-h-[800vh] overflow-x-hidden"
    >
      <div className="fixed inset-0 w-full h-screen z-0 overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-[110vh] bg-cover bg-center"
          style={{ backgroundImage: "url('/forest-bg.jpg')" }}
        />

        <img
          ref={lightningLeftRef}
          src="/lightning-left.png"
          alt="lightning"
          className="absolute top-0 left-0 w-1/2 h-full object-contain opacity-0 pointer-events-none z-[2] mix-blend-screen"
        />
        <img
          ref={lightningRightRef}
          src="/lightning-right.png"
          alt="lightning"
          className="absolute top-0 right-0 w-1/2 h-full object-contain opacity-0 pointer-events-none z-[2] mix-blend-screen"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-15 pointer-events-none mix-blend-screen"
        />
        <div
          ref={treesRef3}
          className="absolute inset-0 left-[16.5vw] w-[60vw] h-full bg-cover bg-center z-5 pointer-events-none opacity-100"
          style={{ backgroundImage: "url('/trees-layer3.png')" }}
        />
        <div
          ref={treesRef2}
          className="absolute inset-0 left-[10vw] w-[70vw] h-full bg-cover bg-center z-10 pointer-events-none opacity-100"
          style={{ backgroundImage: "url('/trees-layer2.png')" }}
        />
        <div
          ref={treesRef}
          className="absolute inset-0 w-[100vw] h-full bg-cover bg-center z-20 pointer-events-none opacity-100"
          style={{ backgroundImage: "url('/trees-layer.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-25" />
      </div>

      <div className="relative z-30">
        <section className="h-[100vh] flex flex-col items-center justify-center">
          <h1 className="text-[20px] tracking-[3em] uppercase opacity-60 text-center pl-[3em]">
            Scroll to Explore{" "}
          </h1>
        </section>

        <section className="max-w-6xl mx-auto flex flex-col gap-y-[70vh] px-10">
          {pairedEvents.map((pair, rowIndex) => (
            <div
              key={rowIndex}
              ref={(el) => (rowRefs.current[rowIndex] = el)}
              className="flex flex-row justify-between items-center gap-10 w-full"
            >
              {pair.map((event) => (
                <div
                  key={event.name}
                  className="mission-card-gsap-wrapper w-[45%] aspect-[3/4] will-change-transform"
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ))}
        </section>

        <div className="h-[100vh]" />
      </div>
    </div>
  );
}