'use client'

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

// Team data - MTG/D&D card style with color themes and character images
const contacts = [
  {
    name: "Yashwanth S",
    role: "Chair",
    type: "Legendary Leader — Visionary",
    email: "secretary.sdc@iiits.in",
    tagline: "When Yashwanth enters the battlefield, all team members gain +2/+2 and vigilance until end of turn.",
    stats: "5/5",
    color: "#0891b2", // Cyan/Teal
    mana: "3UU",
    character: "/characters/wizard.png",
  },
  {
    name: "Charvi Palem",
    role: "Co-Chair",
    type: "Legendary Coordinator — Strategist",
    email: "charvi.p22@iiits.in",
    tagline: "Tap: Look at the top three cards of your library. Put one into your hand and the rest on the bottom.",
    stats: "3/4",
    color: "#f59e0b", // Amber/Gold
    mana: "2WU",
    character: "/characters/mage.png",
  },
  {
    name: "Suyash Tiwari",
    role: "Co-Chair",
    type: "Legendary Creator — Artisan",
    email: "suyash.t22@iiits.in",
    tagline: "At the beginning of each upkeep, create a 1/1 colorless Artifact creature token.",
    stats: "3/3",
    color: "#10b981", // Green
    mana: "2GG",
    character: "/characters/rogue.png",
  },
  {
    name: "Abhinav Mars",
    role: "SLC President",
    type: "Legendary Champion — Student",
    email: "president.slc@iiits.in",
    tagline: "First strike, lifelink. Whenever Abhinav deals combat damage, draw a card.",
    stats: "4/4",
    color: "#dc2626", // Red
    mana: "3RR",
    character: "/characters/warrior.png",
  },
  {
    name: "Kannan M",
    role: "SDC President",
    type: "Legendary Innovator — Engineer",
    email: "president.sdc@iiits.in",
    tagline: "Hexproof. At the beginning of your end step, untap all artifacts you control.",
    stats: "4/5",
    color: "#7c3aed", // Purple
    mana: "2UB",
    character: "/characters/knight.png",
  },
  {
    name: "Shreeraj M",
    role: "Sponsorship Lead",
    type: "Legendary Merchant — Diplomat",
    email: "abhisarga.sponsorship@iiits.in",
    tagline: "When Shreeraj enters the battlefield, add three mana of any color to your mana pool.",
    stats: "2/3",
    color: "#ea580c", // Orange
    mana: "1WG",
    character: "/characters/archer.png",
  }
]

// Card dimensions
const CARD_W = 200
const CARD_H = 280
const SPREAD_GAP = 220

export default function ContactCardsSection() {
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)
  const [phase, setPhase] = useState(0) // 0: idle, 1: shuffling, 2: spreading, 3: spread
  const [hasStarted, setHasStarted] = useState(false)
  const cardControls = contacts.map(() => useAnimation())

  const totalCards = contacts.length
  const centerIndex = (totalCards - 1) / 2

  // Custom intersection observer for better control
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only trigger when element is 60% visible (more centered)
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && !hasStarted) {
            setHasStarted(true)
            runFullAnimation()
          }
        })
      },
      { 
        threshold: [0, 0.3, 0.6, 0.8, 1.0],
        rootMargin: "-10% 0px -10% 0px" // Trigger when more centered
      }
    )

    if (cardsRef.current) {
      observer.observe(cardsRef.current)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  const getSpreadX = (index) => {
    const offset = index - centerIndex
    return offset * SPREAD_GAP
  }

  // Main animation sequence
  const runFullAnimation = async () => {
    // Wait a moment for user to see the stacked deck
    await delay(600)
    
    // Phase 1: Initial lift and gather
    setPhase(1)
    await animateLift()
    await delay(300)
    
    // Phase 2: Shuffle sequence (multiple rounds)
    await shuffleRound(1) // First shuffle
    await delay(200)
    await shuffleRound(2) // Second shuffle  
    await delay(200)
    await shuffleRound(3) // Third shuffle - final
    await delay(400)
    
    // Phase 3: Spread out
    setPhase(2)
    await animateSpread()
    setPhase(3)
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  // Lift cards slightly before shuffling
  const animateLift = async () => {
    const promises = cardControls.map((control, index) => {
      return control.start({
        y: -20,
        scale: 1.02,
        transition: {
          duration: 0.4,
          delay: index * 0.03,
          ease: "easeOut"
        }
      })
    })
    await Promise.all(promises)
  }

  // Single shuffle round with riffle effect
  const shuffleRound = async (round) => {
    const direction = round % 2 === 1 ? 1 : -1
    const intensity = round === 3 ? 0.5 : 1 // Last round is gentler
    
    // Split deck animation - cards fan out
    const fanOut = cardControls.map((control, index) => {
      const isLeftHalf = index < totalCards / 2
      const offsetFromCenter = Math.abs(index - centerIndex)
      
      return control.start({
        x: (isLeftHalf ? -1 : 1) * (40 + offsetFromCenter * 15) * intensity * direction,
        y: -30 - offsetFromCenter * 8,
        rotateZ: (isLeftHalf ? -1 : 1) * (5 + offsetFromCenter * 2) * intensity,
        rotateY: (isLeftHalf ? -1 : 1) * 8 * intensity,
        transition: {
          duration: 0.35,
          delay: index * 0.025,
          ease: [0.25, 0.1, 0.25, 1]
        }
      })
    })
    await Promise.all(fanOut)
    
    await delay(150)
    
    // Riffle together - cards interleave back
    const riffleBack = cardControls.map((control, index) => {
      const staggerDelay = Math.abs(index - centerIndex) * 0.04
      
      return control.start({
        x: (Math.random() - 0.5) * 10, // Slight randomness
        y: -15 + index * 2,
        rotateZ: (Math.random() - 0.5) * 3,
        rotateY: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          delay: staggerDelay,
          ease: [0.34, 1.56, 0.64, 1] // Bounce back
        }
      })
    })
    await Promise.all(riffleBack)
    
    // Settle back to neat stack
    await delay(100)
    const settle = cardControls.map((control, index) => {
      return control.start({
        x: 0,
        y: -index * 2,
        rotateZ: (index - centerIndex) * 0.5,
        rotateY: 0,
        scale: 1 - index * 0.008,
        transition: {
          duration: 0.3,
          delay: index * 0.02,
          ease: "easeOut"
        }
      })
    })
    await Promise.all(settle)
  }

  // Spread cards horizontally
  const animateSpread = async () => {
    const spreadPromises = cardControls.map((control, index) => {
      const spreadX = getSpreadX(index)
      const delayTime = index * 0.1 // Slower stagger
      
      return control.start({
        x: spreadX,
        y: 0,
        rotateZ: 0,
        rotateY: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 60,
          damping: 14,
          mass: 1,
          delay: delayTime,
        }
      })
    })
    await Promise.all(spreadPromises)
  }

  return (
    <section ref={sectionRef} className="relative py-20 min-h-[700px]">
      {/* Header - MTG Style */}
      <motion.div
        className="text-center mb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={hasStarted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h2 
          className="text-4xl md:text-5xl font-bold mb-3 tracking-wide"
          style={{
            color: "#d4c8b8",
            textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 0 40px rgba(212,200,184,0.2)",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          THE GUILD
        </h2>
        <p 
          className="text-sm tracking-widest uppercase"
          style={{ 
            color: "#8a8580",
            fontFamily: "Georgia, serif",
            letterSpacing: "0.3em"
          }}
        >
          Legendary Creatures — Leadership
        </p>
      </motion.div>

      {/* Card Stack Area */}
      <div 
        ref={cardsRef}
        className="relative w-full flex items-center justify-center"
        style={{ 
          height: CARD_H + 120,
          perspective: "1500px"
        }}
      >
        {contacts.map((contact, index) => {
          const stackOffset = index * 2
          const spreadX = getSpreadX(index)
          
          return (
            <motion.div
              key={contact.email}
              className="absolute cursor-pointer"
              style={{
                width: CARD_W,
                height: CARD_H,
                zIndex: phase >= 2 ? index + 10 : totalCards - index,
                transformStyle: "preserve-3d",
              }}
              initial={{
                x: 0,
                y: -stackOffset,
                rotateZ: (index - centerIndex) * 0.5,
                rotateY: 0,
                scale: 1 - index * 0.008,
                opacity: 1,
              }}
              animate={cardControls[index]}
              whileHover={phase === 3 ? {
                y: -25,
                scale: 1.08,
                rotateY: 8,
                zIndex: 100,
                transition: { duration: 0.3, ease: "easeOut" }
              } : {}}
            >
              {/* ================================================== */}
              {/* MTG / D&D CARD - Exact replica style               */}
              {/* ================================================== */}
              <div 
                className="w-full h-full relative overflow-hidden select-none"
                style={{
                  background: "#171314",
                  borderRadius: "12px",
                  padding: "6px",
                  boxShadow: `
                    0 20px 40px -10px rgba(0,0,0,0.8),
                    0 0 0 1px rgba(255,255,255,0.05)
                  `,
                }}
              >
                {/* Inner card frame */}
                <div 
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    background: "#1a1517",
                    borderRadius: "8px",
                    border: "2px solid #2d2a2b",
                  }}
                >
                  {/* === TOP BAR: Name + Mana Cost === */}
                  <div 
                    className="relative mx-1.5 mt-1.5 px-2 py-1 flex items-center justify-between"
                    style={{
                      background: "linear-gradient(180deg, #d4c8b8 0%, #c4b8a4 50%, #b8a890 100%)",
                      borderRadius: "4px 4px 0 0",
                      border: "1px solid #2d2a2b",
                      borderBottom: "none",
                    }}
                  >
                    <span 
                      className="text-xs font-bold tracking-wide"
                      style={{ 
                        color: "#1a1517",
                        fontFamily: "Georgia, serif",
                        textShadow: "0 1px 0 rgba(255,255,255,0.3)"
                      }}
                    >
                      {contact.name}
                    </span>
                    {/* Mana symbols */}
                    <div className="flex gap-0.5">
                      {contact.mana.split('').map((m, i) => (
                        <div 
                          key={i}
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                          style={{
                            background: m === 'U' ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" :
                                       m === 'W' ? "linear-gradient(135deg, #fef9c3 0%, #fde047 100%)" :
                                       m === 'G' ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" :
                                       m === 'R' ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" :
                                       m === 'B' ? "linear-gradient(135deg, #6b7280 0%, #374151 100%)" :
                                       "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
                            color: m === 'W' ? "#1a1517" : "#fff",
                            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(0,0,0,0.3)"
                          }}
                        >
                          {isNaN(m) ? "" : m}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* === ART BOX === */}
                  <div 
                    className="relative mx-1.5 overflow-hidden"
                    style={{
                      height: "95px",
                      background: contact.color,
                      border: "2px solid #2d2a2b",
                    }}
                  >
                    {/* Art background gradient */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, ${contact.color}dd 0%, ${contact.color} 100%)`,
                      }}
                    />
                    {/* Pixel character image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={contact.character}
                        alt={contact.name}
                        className="h-20 w-auto object-contain"
                        style={{
                          imageRendering: "pixelated",
                          filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))"
                        }}
                      />
                    </div>
                  </div>

                  {/* === TYPE LINE === */}
                  <div 
                    className="relative mx-1.5 px-2 py-0.5"
                    style={{
                      background: "linear-gradient(180deg, #d4c8b8 0%, #c4b8a4 50%, #b8a890 100%)",
                      border: "1px solid #2d2a2b",
                      borderTop: "none",
                    }}
                  >
                    <span 
                      className="text-[9px] font-semibold"
                      style={{ 
                        color: "#1a1517",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {contact.type}
                    </span>
                  </div>

                  {/* === TEXT BOX === */}
                  <div 
                    className="relative mx-1.5 mt-0.5 p-2 flex-1"
                    style={{
                      background: "linear-gradient(180deg, #e8dfd0 0%, #d8cfc0 100%)",
                      border: "2px solid #2d2a2b",
                      borderRadius: "0 0 4px 4px",
                      minHeight: "70px",
                    }}
                  >
                    {/* Card ability text */}
                    <p 
                      className="text-[8px] leading-tight mb-2"
                      style={{ 
                        color: "#1a1517",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {contact.tagline}
                    </p>

                    {/* Divider line */}
                    <div 
                      className="w-full h-px my-1"
                      style={{ background: "rgba(0,0,0,0.15)" }}
                    />

                    {/* Email as flavor text */}
                    <p 
                      className="text-[7px] italic"
                      style={{ 
                        color: "#4a4540",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      <a 
                        href={`mailto:${contact.email}`}
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ✉ {contact.email}
                      </a>
                    </p>
                  </div>

                  {/* === BOTTOM BAR: Stats === */}
                  <div 
                    className="absolute bottom-1.5 right-2 px-2 py-0.5"
                    style={{
                      background: "linear-gradient(180deg, #d4c8b8 0%, #b8a890 100%)",
                      borderRadius: "4px",
                      border: "1px solid #2d2a2b",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                  >
                    <span 
                      className="text-sm font-bold"
                      style={{ 
                        color: "#1a1517",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {contact.stats}
                    </span>
                  </div>

                  {/* Set symbol area (bottom left) */}
                  <div 
                    className="absolute bottom-1.5 left-2 text-[6px]"
                    style={{ color: "#6b6560" }}
                  >
                    ABH • 2026
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Subtle ambient glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-32 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(212,200,184,0.08) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}
      />
    </section>
  )
}
