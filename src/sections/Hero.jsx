'use client'

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { heroStats, upsideQuotes } from "../data/content"

const glitchChars = "ABHISARGA0123456789ΔΛΞΨ∑#@$%*&"

function useGlitch(baseText) {
  const [text, setText] = useState(baseText)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const position = Math.floor(Math.random() * baseText.length)
        const replacement = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        const arr = baseText.split("")
        arr[position] = replacement
        setText(arr.join(""))
        setTimeout(() => setText(baseText), 120)
      }
    }, 120)

    return () => clearInterval(interval)
  }, [baseText])

  return text
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const planetY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const fragmentsY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
  const portalScale = useTransform(scrollYProgress, [0, 1], [1, 1.3])
  const glitchTitle = useGlitch("ABHISARGA")

  return (
    <section
      id="hero"
      ref={ref}
      className="parallax-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      <motion.div
        style={{ y: planetY }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,37,70,0.35),transparent_55%)]"
      />

      <motion.div
        style={{ y: fragmentsY }}
        className="pointer-events-none absolute inset-0 opacity-50"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] mix-blend-screen" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-red-300">IIIT SriCity Presents</p>

        <motion.div style={{ scale: portalScale }} className="space-y-6">
          <div className="glitch-text text-6xl font-bold md:text-8xl">
            <span className="relative inline-flex flex-col">
              <span className="text-white drop-shadow-[0_0_25px_rgba(255,37,70,0.6)]">{glitchTitle}</span>
              <span className="text-red-500/60 text-3xl tracking-[0.4em]">UPSIDE DOWN '26</span>
            </span>
          </div>
          <p className="mx-auto max-w-2xl text-base uppercase tracking-[0.4em] text-white/70 md:text-lg">
            A THREE-DAY TECHNO-CULTURAL PORTAL EXPERIENCE
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="border border-white/10 bg-white/5 px-6 py-6 backdrop-blur-xl">
              <p className="text-4xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
          <a
            href="#events"
            className="inline-flex items-center justify-center border border-red-500/40 bg-red-500/20 px-10 py-4 text-xs uppercase tracking-[0.4em] text-white transition hover:border-white/80 hover:bg-red-500/40"
          >
            Enter the Rift
          </a>
          <a
            href="#schedule"
            className="inline-flex items-center justify-center border border-white/20 px-10 py-4 text-xs uppercase tracking-[0.4em] text-white/80 transition hover:border-white/60 hover:text-white"
          >
            View Schedule
          </a>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-[0.65rem] uppercase tracking-[0.6em] text-white/50">Scroll to flip realities</p>
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-16 w-px bg-linear-to-b from-transparent via-red-500/80 to-transparent"
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {upsideQuotes.map((quote, index) => (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded border border-white/10 bg-white/5 p-6 text-sm text-white/80"
            >
              {quote}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
