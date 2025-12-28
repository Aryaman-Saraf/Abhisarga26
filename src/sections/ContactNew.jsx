import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import GuildMap from "../components/GuildMap"
import { Star, Send } from "lucide-react"
// Use the 144x128 sheet for better framing (3 frames x 4 directions)
import dragonSprite from "../../dragon/PNG/144x128/flying_dragon-red.png"

const contacts = [
  {
    name: "Yashwanth S",
    role: "Chair",
    email: "secretary.sdc@iiits.in",
    class: "Paladin"
  },
  {
    name: "Charvi Palem",
    role: "Co-Chair", 
    email: "charvi.p22@iiits.in",
    class: "Wizard"
  },
  {
    name: "Suyash Tiwari",
    role: "Co-Chair",
    email: "suyash.t22@iiits.in", 
    class: "Rogue"
  },
  {
    name: "Abhinav Mars",
    role: "SLC President",
    email: "president.slc@iiits.in",
    class: "Warrior"
  },
  {
    name: "Kannan M",
    role: "SDC President", 
    email: "president.sdc@iiits.in",
    class: "Mage"
  },
  {
    name: "Shreeraj M",
    role: "Sponsorship Lead",
    email: "abhisarga.sponsorship@iiits.in",
    class: "Merchant"
  }
]

export default function Contact() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Dragon flyover duration (further slowed for full visibility ~3.0s)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <DragonFlyover />
  }

  return (
    <div className="relative min-h-screen bg-linear-to-b from-amber-950/20 via-stone-900 to-black text-white overflow-hidden">
      {/* Guild Hall Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#d97706_0%,transparent_50%)] opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,#dc2626_0%,transparent_50%)] opacity-10"></div>
        
        {/* Floating parchment pieces */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 bg-amber-100/5 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [-5, 5, -5],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 py-32">
        {/* Guild Hall Hero */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 bg-linear-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            The Adventurer's Guild
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-amber-100/80 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Seek guidance from our experienced guild members and plan your journey to Abhisarga'26
          </motion.p>
        </motion.div>

        {/* Contact Our Wizards Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Star className="w-6 h-6 text-amber-400" />
              <h2 className="text-4xl font-bold text-amber-200">Contact Our Wizards</h2>
              <Star className="w-6 h-6 text-amber-400" />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contacts.map((contact, index) => (
              <WizardCard key={index} contact={contact} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Journey Map Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-200 mb-4">Plan Your Journey</h2>
            <p className="text-amber-100/60 text-lg">Chart your path to the guild hall</p>
          </div>

          <div className="bg-stone-900/50 border border-amber-600/20 rounded-2xl p-8">
            <GuildMap />
          </div>
        </motion.section>

        {/* Raven Messenger Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-200 mb-4">Send a Raven</h2>
            <p className="text-amber-100/60 text-lg">Dispatch a message to the guild</p>
          </div>

          <div className="max-w-2xl mx-auto bg-stone-900/50 border border-amber-600/20 rounded-2xl p-8">
            <RavenMessenger />
          </div>
        </motion.section>
      </div>
    </div>
  )
}

// Guild Hall Loader Component
function DragonFlyover() {
  const frameWidth = 144
  const frameHeight = 128
  const frames = 3
  const eastRow = 1 // east-facing row

  const [viewportWidth, setViewportWidth] = useState(1280)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth)
    }
  }, [])

  // Keyframes for smooth sprite stepping using background-position (pixel-perfect)
  const flapKeyframes = useMemo(() => `
    @keyframes dragon-flap {
      from { background-position: 0px -${frameHeight * eastRow}px; }
      to { background-position: -${frameWidth * (frames - 1)}px -${frameHeight * eastRow}px; }
    }
  `, [])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <style>{flapKeyframes}</style>

      {/* Dragon shadow/glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.25)_0%,transparent_60%)]" />

      {/* Dragon sprite + fire trail */}
      <motion.div
        className="absolute"
        initial={{ x: -frameWidth * 2.8, y: 60, rotate: -2, scale: 1.2 }}
        animate={{ x: viewportWidth + frameWidth * 2.2, y: 30, rotate: 4, scale: 1.32 }}
        transition={{ duration: 3.0, ease: "easeInOut" }}
      >
        {/* Fire trail */}
        <motion.div
          className="absolute -left-20 top-6 w-28 h-10"
          style={{
            background: "radial-gradient(ellipse at 80% 50%, rgba(255,136,68,0.9), rgba(255,68,68,0.3) 50%, transparent 70%)",
            filter: "blur(6px)",
          }}
          animate={{
            opacity: [0.7, 0.9, 0.3],
            scaleX: [1, 1.2, 0.8],
            scaleY: [1, 0.9, 1.1],
          }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Dragon sprite sheet with background-position stepping */}
        <div
          className="relative overflow-hidden"
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            filter: "drop-shadow(0 0 22px rgba(255, 80, 80, 0.8)) drop-shadow(-6px 4px 18px rgba(0,0,0,0.8))",
            imageRendering: "pixelated",
          }}
        >
          <div
            style={{
              width: `${frameWidth * frames}px`,
              height: `${frameHeight * 4}px`,
              backgroundImage: `url(${dragonSprite})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${frameWidth * frames}px ${frameHeight * 4}px`,
              backgroundPosition: `0px -${frameHeight * eastRow}px`,
              animation: "dragon-flap 0.95s steps(3, end) infinite",
              willChange: "background-position",
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

// Wizard Card Component (simplified like last year)
function WizardCard({ contact, index }) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="bg-stone-900/60 backdrop-blur border border-amber-600/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <motion.h3
            className="text-xl font-bold text-amber-200 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {contact.name}
          </motion.h3>

          <motion.p
            className="text-amber-100/70 mb-4 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {contact.role}
          </motion.p>

          <motion.a
            href={`mailto:${contact.email}`}
            className="text-amber-300 hover:text-white transition-colors text-sm block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            {contact.email}
          </motion.a>

          <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-70 transition-opacity">
            <span className="text-xs text-amber-400 font-mono">{contact.class}</span>
          </div>
        </div>

        <div className="absolute inset-0 border-2 border-amber-400/0 group-hover:border-amber-400/30 rounded-xl transition-colors duration-500" />
      </div>
    </motion.div>
  )
}

// Raven Messenger Component
function RavenMessenger() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    urgency: "normal"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", message: "", urgency: "normal" })
    }, 3000)
  }

  if (submitted) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ x: [0, 100, 200, 300], y: [0, -20, -40, -60] }}
          transition={{ duration: 2 }}
        >
          🐦‍⬛
        </motion.div>
        <h3 className="text-2xl font-bold text-amber-200 mb-2">Raven Dispatched!</h3>
        <p className="text-amber-100/80">Your message is on its way to the guild</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-amber-200 font-semibold mb-2">Your name, traveler:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-3 bg-stone-800 border border-amber-600/30 rounded-lg text-white placeholder-amber-300/50 focus:border-amber-400 focus:outline-none"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label className="block text-amber-200 font-semibold mb-2">Message contents:</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={4}
          className="w-full px-4 py-3 bg-stone-800 border border-amber-600/30 rounded-lg text-white placeholder-amber-300/50 focus:border-amber-400 focus:outline-none resize-none"
          placeholder="Write your message to the guild..."
          required
        />
      </div>

      <div>
        <label className="block text-amber-200 font-semibold mb-2">Urgency level:</label>
        <select
          value={formData.urgency}
          onChange={(e) => setFormData({...formData, urgency: e.target.value})}
          className="w-full px-4 py-3 bg-stone-800 border border-amber-600/30 rounded-lg text-white focus:border-amber-400 focus:outline-none"
        >
          <option value="low">Low - Standard raven</option>
          <option value="normal">Normal - Swift raven</option>
          <option value="high">High - Express raven</option>
          <option value="urgent">Urgent - Dragon courier</option>
        </select>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Preparing Raven...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Dispatch Raven
          </>
        )}
      </motion.button>
    </form>
  )
}