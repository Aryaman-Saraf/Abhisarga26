import { motion } from "framer-motion"

export default function PortalHeader({ title, subtitle }) {
  return (
    <div className="relative z-10 text-center mb-16">
      {/* Background Portal Tear Animation */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] -z-10 pointer-events-none">
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-60 mix-blend-screen">
          <defs>
            <filter id="displacementFilter">
              <feTkrbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
            </filter>
            <radialGradient id="portalGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff2546" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#7600e0" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <motion.ellipse
            cx="100"
            cy="50"
            rx="60"
            ry="25"
            fill="url(#portalGrad)"
            filter="url(#displacementFilter)"
            animate={{
              rx: [60, 65, 60],
              ry: [25, 30, 25],
              filter: ["url(#displacementFilter)", "url(#displacementFilter)"], // Re-trigger repaint
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs uppercase tracking-[0.6em] text-red-400 mb-2">{subtitle}</p>
        <h2 className="text-5xl md:text-6xl text-white font-bold drop-shadow-[0_0_15px_rgba(255,37,70,0.5)]">
          {title}
        </h2>
      </motion.div>
    </div>
  )
}