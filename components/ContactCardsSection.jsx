'use client'

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

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

// Card dimensions - Larger cards for better visibility
const CARD_W = 260
const CARD_H = 340
const CARD_GAP_X = 350 // Horizontal gap
const CARD_GAP_Y = 380 // Vertical gap

export default function ContactCardsSection() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    // Ensure GSAP is available
    if (typeof window === 'undefined') return

    const cards = cardsRef.current.filter(Boolean)
    if (cards.length === 0) return

    // Set initial state - extremely small and deep
    cards.forEach((card) => {
      gsap.set(card, {
        scale: 0.1, // Start extremely small (0.1x)
        z: -900,    // Much deeper in background
        y: 200,     // Start lower
        opacity: 0,
        filter: 'blur(30px)', // Heavier blur
        transformOrigin: 'center center',
        visibility: 'visible',
        rotationX: 45 // Steep tilt
      })
    })

    // Create timeline for dramatic emergence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',       // Start LATE
        end: 'bottom 90%',      // End much later (when bottom of section is near viewport bottom)
        scrub: 5,               // High scrub for heavy/slow feel
        pin: false,
        onEnter: () => {
          cards.forEach(card => card.classList.add('card-emerged'))
        },
        onLeaveBack: () => {
          cards.forEach(card => card.classList.remove('card-emerged'))
        }
      }
    })

    // Animation: Cards rise up, scale up, and untilt
    cards.forEach((card) => {
      tl.to(card, {
        scale: 1,
        z: 0,
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        rotationX: 0,
        duration: 3,              
        ease: 'power2.out'        
      }, 0)
    })

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // 3x3 Grid Layout Calculation
  const getCardPosition = (index) => {
    const row = Math.floor(index / 3) // 0 or 1
    const col = index % 3            // 0, 1, 2
    
    // Center the grid
    // Rows: 2 rows total. Center is 0.5. Offsets: -0.5, 0.5
    // Cols: 3 cols total. Center is 1. Offsets: -1, 0, 1
    
    const x = (col - 1) * CARD_GAP_X
    const y = (row - 0.5) * CARD_GAP_Y
    
    return { x, y }
  }

  return (
    <section ref={sectionRef} className="relative py-20 min-h-screen w-full overflow-hidden flex flex-col justify-center">
      {/* Background removed to be transparent */}

      {/* Header - MTG Style */}
      <div className="text-center mb-24 relative z-10">
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
      </div>

      {/* Card Container with 3D Perspective - Full Width */}
      <div 
        className="relative w-full h-200 flex items-center justify-center"
        style={{ 
          perspective: "1200px", // Lower perspective for more dramatic 3D
          perspectiveOrigin: "center center",
          zIndex: 10,
        }}
      >
        {contacts.map((contact, index) => {
          const pos = getCardPosition(index)
          
          return (
            <div
              key={contact.email}
              ref={(el) => (cardsRef.current[index] = el)}
              className="absolute cursor-pointer card-emergence"
              style={{
                width: CARD_W,
                height: CARD_H,
                left: '50%',
                top: '50%',
                marginLeft: pos.x - CARD_W / 2,
                marginTop: pos.y - CARD_H / 2,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity, filter",
                // Removed visibility: hidden to prevent cards disappearing if JS fails
              }}
            >
              {/* ================================================== */}
              {/* MTG / D&D CARD - Large Size                        */}
              {/* ================================================== */}
              <div 
                className="w-full h-full relative overflow-hidden select-none group"
                style={{
                  background: "#171314",
                  borderRadius: "14px",
                  padding: "8px",
                  boxShadow: `
                    0 25px 50px -12px rgba(0,0,0,0.9),
                    0 0 0 1px rgba(255,255,255,0.08)
                  `,
                  fontSize: '1em'
                }}
              >
                {/* Inner card frame */}
                <div 
                  className="w-full h-full relative overflow-hidden flex flex-col"
                  style={{
                    background: "#1a1517",
                    borderRadius: "10px",
                    border: "2px solid #2d2a2b",
                  }}
                >
                  {/* === TOP BAR === */}
                  <div 
                    className="relative mx-1.5 mt-1.5 px-2 py-1 flex items-center justify-between shrink-0"
                    style={{
                      background: "linear-gradient(180deg, #d4c8b8 0%, #c4b8a4 50%, #b8a890 100%)",
                      borderRadius: "4px 4px 0 0",
                      border: "1px solid #2d2a2b",
                      borderBottom: "none",
                    }}
                  >
                    <span className="text-[10px] font-bold tracking-wide text-[#1a1517] font-serif">
                      {contact.name}
                    </span>
                    <div className="flex gap-0.5">
                      {contact.mana.split('').map((m, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-bold border border-black/20 ${
                          m === 'U' ? "bg-blue-500 text-white" :
                          m === 'W' ? "bg-yellow-200 text-black" :
                          m === 'G' ? "bg-green-600 text-white" :
                          m === 'R' ? "bg-red-600 text-white" :
                          m === 'B' ? "bg-gray-800 text-white" : "bg-gray-400"
                        }`}>
                          {isNaN(m) ? "" : m}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* === ART BOX - LARGER === */}
                  <div 
                    className="relative mx-1.5 border-2 border-[#2d2a2b] bg-gray-900 overflow-hidden grow"
                    style={{
                      maxHeight: "140px",
                      background: contact.color
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/40" />
                    <img 
                      src={contact.character}
                      alt={contact.name}
                      className="absolute inset-0 w-full h-full object-contain p-2"
                      style={{
                        imageRendering: "pixelated", 
                        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                      }}
                    />
                  </div>

                  {/* === TYPE LINE === */}
                  <div 
                    className="relative mx-1.5 px-2 py-0.5 shrink-0 z-10"
                    style={{
                      background: "linear-gradient(180deg, #d4c8b8 0%, #c4b8a4 50%, #b8a890 100%)",
                      border: "1px solid #2d2a2b",
                      borderTop: "none",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                  >
                    <span className="text-[8px] font-semibold text-[#1a1517] font-serif">
                      {contact.type}
                    </span>
                  </div>

                  {/* === TEXT BOX === */}
                  <div 
                    className="relative mx-1.5 mt-0.5 p-2 grow flex flex-col justify-start"
                    style={{
                      background: "linear-gradient(180deg, #e8dfd0 0%, #d8cfc0 100%)",
                      border: "2px solid #2d2a2b",
                      borderRadius: "0 0 4px 4px",
                    }}
                  >
                    <p className="text-[9px] leading-tight mb-2 text-[#1a1517] font-serif">
                      {contact.tagline}
                    </p>
                    <div className="w-full h-px bg-black/10 my-auto" />
                    <p className="text-[8px] italic text-[#4a4540] font-serif mt-1">
                      {contact.email}
                    </p>
                  </div>

                  {/* === STATS === */}
                  <div 
                    className="absolute bottom-1.5 right-2 px-2 py-0.5 bg-linear-to-b from-[#d4c8b8] to-[#b8a890] rounded border border-[#2d2a2b] shadow-md z-20"
                  >
                    <span className="text-xs font-bold text-[#1a1517] font-serif">
                      {contact.stats}
                    </span>
                  </div>
                </div>
              </div>              {/* Card shadow for depth */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-12 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse, rgba(0,0,0,0.8), transparent)",
                  filter: "blur(20px)",
                  zIndex: -1,
                  opacity: 0,
                  transform: 'translateY(40px) scale(0.8)'
                }}
              />
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .card-emerged .card-emergence {
          /* Add subtle float animation after emergence */
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}
