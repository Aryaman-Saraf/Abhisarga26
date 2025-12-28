import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, Mail, Phone, Shield } from "lucide-react"
import { useState } from "react"

export default function ContactCard({ role, name, phone, email, delay }) {
  const [copied, setCopied] = useState(null)

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1 }}
      className="relative group"
    >
      {/* Scroll Background */}
      <div className="absolute inset-0 bg-neutral-900 border border-neutral-700/50 clip-path-scroll transform skew-x-1 group-hover:skew-x-0 transition-transform duration-500" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />
      
      {/* Glowing Border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-900/0 via-red-500/20 to-red-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <div className="relative p-6 flex flex-col gap-4 z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-500/10 rounded-full border border-red-500/20">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl text-white font-bold tracking-wider">{name}</h3>
            <p className="text-xs text-red-300/80 uppercase tracking-[0.2em]">{role}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleCopy(phone, "phone")}
            className="flex items-center justify-between w-full p-3 bg-black/40 border border-white/5 hover:border-red-500/30 transition-colors group/btn text-sm"
          >
            <div className="flex items-center gap-3 text-neutral-300">
              <Phone className="w-4 h-4" />
              <span className="font-mono tracking-widest">{phone}</span>
            </div>
            <div className="relative">
              <AnimatePresence mode="wait">
                {copied === "phone" ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div key="copy">
                    <Copy className="w-4 h-4 text-neutral-600 group-hover/btn:text-red-400 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>

          <button
            onClick={() => handleCopy(email, "email")}
            className="flex items-center justify-between w-full p-3 bg-black/40 border border-white/5 hover:border-red-500/30 transition-colors group/btn text-sm"
          >
            <div className="flex items-center gap-3 text-neutral-300">
              <Mail className="w-4 h-4" />
              <span className="truncate max-w-[180px] font-mono tracking-widest">{email}</span>
            </div>
            <div className="relative">
              <AnimatePresence mode="wait">
                {copied === "email" ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div key="copy">
                    <Copy className="w-4 h-4 text-neutral-600 group-hover/btn:text-red-400 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}