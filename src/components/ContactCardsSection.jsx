import { Mail, Sparkles } from "lucide-react"
import { useRef, useState } from "react"
import "./ContactCards3D.css"

// Team members data with lava/fire colors
const contacts = [
  {
    name: "Yashwanth S",
    role: "Chair",
    email: "secretary.sdc@iiits.in",
    tagline: "Leading the guild forward",
    color: "239, 68, 68" // red-500
  },
  {
    name: "Charvi Palem",
    role: "Co-Chair", 
    email: "charvi.p22@iiits.in",
    tagline: "Orchestrating great adventures",
    color: "249, 115, 22" // orange-500
  },
  {
    name: "Suyash Tiwari",
    role: "Co-Chair",
    email: "suyash.t22@iiits.in",
    tagline: "Bringing visions to life",
    color: "234, 88, 12" // orange-600
  },
  {
    name: "Abhinav Mars",
    role: "SLC President",
    email: "president.slc@iiits.in",
    tagline: "Student leadership excellence",
    color: "220, 38, 38" // red-600
  },
  {
    name: "Kannan M",
    role: "SDC President", 
    email: "president.sdc@iiits.in",
    tagline: "Driving innovation forward",
    color: "251, 146, 60" // orange-400
  },
  {
    name: "Shreeraj M",
    role: "Sponsorship Lead",
    email: "abhisarga.sponsorship@iiits.in",
    tagline: "Building powerful partnerships",
    color: "185, 28, 28" // red-700
  }
]

export default function ContactCardsSection() {
  const sectionRef = useRef(null)
  const quantity = contacts.length
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section className="relative py-8" ref={sectionRef}>
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-red-500" />
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            Meet The Team
          </h2>
          <Sparkles className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-red-200/70 text-lg">
          The brilliant minds behind Abhisarga'26
        </p>
      </div>

      {/* 3D Rotating Carousel */}
      <div 
        className="carousel-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className={`carousel-inner ${isPaused ? 'paused' : ''}`}
          style={{ "--quantity": quantity }}
        >
          {contacts.map((contact, index) => (
            <div 
              key={contact.email}
              className="carousel-card"
              style={{ 
                "--index": index,
                "--color-card": contact.color
              }}
            >
              <div className="card-content">
                {/* Glowing border effect */}
                <div className="card-glow"></div>
                
                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg relative z-10">
                  {contact.name}
                </h3>
                
                {/* Role badge */}
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 relative z-10"
                  style={{ 
                    background: `rgba(${contact.color}, 0.3)`,
                    border: `1px solid rgba(${contact.color}, 0.6)`,
                    color: `rgb(${contact.color})`
                  }}
                >
                  {contact.role}
                </span>
                
                {/* Divider */}
                <div className="flex items-center gap-2 w-full mb-3 relative z-10">
                  <div 
                    className="h-px flex-1"
                    style={{ background: `rgba(${contact.color}, 0.4)` }}
                  />
                  <div 
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: `rgb(${contact.color})` }}
                  />
                  <div 
                    className="h-px flex-1"
                    style={{ background: `rgba(${contact.color}, 0.4)` }}
                  />
                </div>
                
                {/* Tagline */}
                <p className="text-white/60 text-xs italic mb-4 leading-relaxed relative z-10">
                  {contact.tagline}
                </p>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105 relative z-10"
                  style={{ 
                    background: `rgba(${contact.color}, 0.2)`,
                    border: `1px solid rgba(${contact.color}, 0.4)`,
                    color: `rgb(${contact.color})`
                  }}
                >
                  <Mail className="w-3 h-3" />
                  <span className="font-mono text-[10px]">{contact.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instruction text */}
      <p className="text-center text-red-200/50 text-sm mt-6">
        ✨ Hover to pause rotation
      </p>
    </section>
  )
}
