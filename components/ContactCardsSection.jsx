'use client'

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Copy, Check } from "lucide-react"

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Team data - MTG/D&D card style with color themes and character images
const contacts = [
  {
    name: "Yashwanth S",
    role: "Chair",
    email: "secretary.sdc@iiits.in",
    color: "#0891b2", // Cyan/Teal
    character: "https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/units/human-magi/white-mage.png",
  },
  {
    name: "Charvi Palem",
    role: "Co-Chair",
    email: "charvi.p22@iiits.in",
    color: "#f59e0b", // Amber/Gold
    character: "https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/units/human-magi/arch-mage.png",
  },
  {
    name: "Suyash Tiwari",
    role: "Co-Chair",
    email: "suyash.t22@iiits.in",
    color: "#10b981", // Green
    character: "https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/units/human-loyalists/fencer.png",
  },
  {
    name: "Abhinav Mars",
    role: "SLC President",
    email: "president.slc@iiits.in",
    color: "#dc2626", // Red
    character: "https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/units/human-loyalists/royalguard.png",
  },
  {
    name: "Kannan M",
    role: "SDC President",
    email: "president.sdc@iiits.in",
    color: "#7c3aed", // Purple
    character: "https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/units/human-loyalists/lieutenant.png",
  },
  {
    name: "Shreeraj M",
    role: "Sponsorship Lead",
    email: "abhisarga.sponsorship@iiits.in",
    color: "#ea580c", // Orange
    character: "https://raw.githubusercontent.com/wesnoth/wesnoth/master/data/core/images/units/human-loyalists/longbowman.png",
  }
]

// Card dimensions - Larger cards for better visibility
const CARD_W = 220
const CARD_H = 280
const CARD_GAP_X = 350 // Horizontal gap
const CARD_GAP_Y = 320 // Vertical gap

export default function ContactCardsSection() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const [copiedEmail, setCopiedEmail] = useState(null)

  const handleCopy = (email, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

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
        pin: false
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
              className="absolute cursor-pointer"
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
                    className="relative mx-1.5 mt-1.5 px-2 py-2 flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(180deg, #d4c8b8 0%, #c4b8a4 50%, #b8a890 100%)",
                      borderRadius: "4px 4px 0 0",
                      border: "1px solid #2d2a2b",
                      borderBottom: "none",
                    }}
                  >
                    <span className="text-base font-extrabold tracking-wide text-[#1a1517] font-serif uppercase text-center">
                      {contact.name}
                    </span>
                  </div>

                  {/* === ART BOX === */}
                  <div 
                    className="relative mx-1.5 border-2 border-[#2d2a2b] bg-gray-900 overflow-hidden shrink-0"
                    style={{
                      background: contact.color,
                      height: "120px"
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
                    className="relative mx-1.5 px-2 py-1.5 shrink-0 z-10 flex justify-center items-center"
                    style={{
                      background: "linear-gradient(180deg, #d4c8b8 0%, #c4b8a4 50%, #b8a890 100%)",
                      border: "1px solid #2d2a2b",
                      borderTop: "none",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                  >
                    <span className="text-xs font-bold text-[#1a1517] font-serif uppercase tracking-wider text-center">
                      {contact.role}
                    </span>
                  </div>

                  {/* === TEXT BOX === */}
                  <div 
                    className="relative mx-1.5 mt-0.5 p-2 grow flex flex-col justify-center items-center"
                    style={{
                      background: "linear-gradient(180deg, #e8dfd0 0%, #d8cfc0 100%)",
                      border: "2px solid #2d2a2b",
                      borderRadius: "0 0 4px 4px",
                      minHeight: "50px"
                    }}
                  >
                    <button 
                      onClick={(e) => handleCopy(contact.email, e)}
                      className="group/btn flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1517]/5 hover:bg-[#1a1517]/10 border border-[#1a1517]/10 hover:border-[#1a1517]/20 transition-all w-full justify-center"
                    >
                      <span className="text-xs text-[#1a1517] font-serif font-bold tracking-wide truncate">
                        {contact.email}
                      </span>
                      {copiedEmail === contact.email ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#1a1517]/60 group-hover/btn:text-[#1a1517]" />
                      )}
                    </button>
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
    </section>
  )
}
