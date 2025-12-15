import { motion } from "framer-motion"

export default function PortalPulse() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(255,37,70,0.3), transparent 45%), radial-gradient(circle at 80% 20%, rgba(118,0,224,0.25), transparent 40%), radial-gradient(circle at 60% 70%, rgba(255,37,70,0.2), transparent 35%)",
        }}
      />

      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(120deg, rgba(255,37,70,0.06) 0%, transparent 35%, rgba(255,37,70,0.05) 70%, transparent)" }} />

      <motion.div
        className="absolute left-1/2 top-0 h-full w-px bg-linear-to-b from-transparent via-red-500/20 to-transparent"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
