import { Mail, Zap } from "lucide-react"
import { useRef, useEffect, useState, useCallback } from "react"
import { motion, useAnimation, animate } from "framer-motion"

// Team data - Stranger Things themed
const contacts = [
  {
    name: "Yashwanth S",
    role: "Chair",
    email: "secretary.sdc@iiits.in",
    tagline: "Leading the guild forward",
  },
  {
    name: "Charvi Palem",
    role: "Co-Chair",
    email: "charvi.p22@iiits.in",
    tagline: "Orchestrating great adventures",
  },
  {
    name: "Suyash Tiwari",
    role: "Co-Chair",
    email: "suyash.t22@iiits.in",
    tagline: "Bringing visions to life",
  },
  {
    name: "Abhinav Mars",
    role: "SLC President",
    email: "president.slc@iiits.in",
    tagline: "Student leadership excellence",
  },
  {
    name: "Kannan M",
    role: "SDC President",
    email: "president.sdc@iiits.in",
    tagline: "Driving innovation forward",
  },
  {
    name: "Shreeraj M",
    role: "Sponsorship Lead",
    email: "abhisarga.sponsorship@iiits.in",
    tagline: "Building powerful partnerships",
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
      {/* Header */}
      <motion.div
        className="text-center mb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={hasStarted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h2 
          className="text-4xl md:text-5xl font-black text-red-500 mb-3 tracking-tight"
          style={{
            textShadow: "0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(220,38,38,0.3)",
          }}
        >
          THE GUILD
        </h2>
        <p className="text-red-200/60 text-lg tracking-widest uppercase">
          Friends don&apos;t lie
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
              {/* STRANGER THINGS METALLIC CARD */}
              <div 
                className="w-full h-full rounded-lg relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)",
                  border: "2px solid #2a2a2a",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)",
                }}
              >
                {/* Metallic shine overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)",
                  }}
                />

                {/* Top red accent line - Stranger Things style */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: "linear-gradient(90deg, transparent, #dc2626, #ef4444, #dc2626, transparent)",
                    boxShadow: "0 0 20px rgba(220,38,38,0.6), 0 0 40px rgba(220,38,38,0.3)"
                  }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col p-5">
                  {/* Top section with lightning icon */}
                  <div className="flex justify-end mb-4">
                    <Zap 
                      className="w-5 h-5" 
                      style={{ 
                        color: "#dc2626",
                        filter: "drop-shadow(0 0 8px rgba(220,38,38,0.8))"
                      }} 
                    />
                  </div>

                  {/* Main content - centered */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    {/* Name - bold, metallic look */}
                    <h3 
                      className="text-xl font-black tracking-wide mb-2"
                      style={{
                        color: "#e5e5e5",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                      }}
                    >
                      {contact.name.toUpperCase()}
                    </h3>

                    {/* Role badge */}
                    <div 
                      className="px-4 py-1.5 rounded mb-4"
                      style={{
                        background: "linear-gradient(180deg, #2d1515 0%, #1a0a0a 100%)",
                        border: "1px solid #4a1a1a",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
                      }}
                    >
                      <span 
                        className="text-xs font-bold tracking-widest uppercase"
                        style={{ color: "#dc2626" }}
                      >
                        {contact.role}
                      </span>
                    </div>

                    {/* Divider line */}
                    <div className="w-16 h-px bg-linear-to-r from-transparent via-red-600/50 to-transparent mb-4" />

                    {/* Tagline */}
                    <p 
                      className="text-xs leading-relaxed mb-4 px-2"
                      style={{ color: "#737373" }}
                    >
                      {contact.tagline}
                    </p>
                  </div>

                  {/* Bottom section - contact button */}
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center justify-center gap-2 py-2.5 rounded transition-all duration-300 group"
                    style={{
                      background: "linear-gradient(180deg, #1f1f1f 0%, #141414 100%)",
                      border: "1px solid #333",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                    <span className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-300 tracking-wide">
                      CONTACT
                    </span>
                  </a>
                </div>

                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-red-600/30" />
                <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-red-600/30" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-red-600/30" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-red-600/30" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Ambient red glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-32 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center bottom, rgba(220,38,38,0.15) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}
      />
    </section>
  )
}
