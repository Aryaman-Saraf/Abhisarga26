'use client'

import { motion } from "framer-motion"
import { useRef } from "react"

const highlights = [
  {
    title: "The Upside Down Brief",
    text:
      "Abhisarga '26 transforms IIIT Sri City into a cinematic portal drenched in synth red, dark violets, and humming neon. It's a playground where techies, artists, gamers, and storytellers collide without gravity.",
  },
  {
    title: "Immersive Storyline",
    text:
      "Every venue is reimagined as a scene from Hawkins—glowing woods, static-filled corridors, and flickering walkie transmissions guiding attendees through quests.",
  },
  {
    title: "Why Parallax Everything?",
    text: "Because we want visitors to feel the terrain shifting under their feet. Layers move independently, mirroring alternate realities bleeding into ours.",
  },
]

export default function About() {
  const ref = useRef(null)

  return (
    <section id="about" ref={ref} className="relative overflow-hidden px-4 py-32">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-500/5 to-transparent" />
      <div className="absolute inset-y-0 left-1/2 hidden w-px bg-linear-to-b from-transparent via-white/10 to-transparent md:block" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-10">
          <p className="text-xs uppercase tracking-[0.6em] text-red-200">About the realm</p>
          <h2 className="text-4xl md:text-5xl">IIIT Sri City x Upside Down Narrative</h2>
          <p className="text-base leading-relaxed text-white/70">
            Since 2013, IIIT Sri City has nurtured bold builders. Abhisarga takes that restless energy and filters it through the
            Stranger Things lens. Expect synth choirs, analog glitches, fearless performances, and hallways filled with
            experimental tech.
          </p>
          <div className="space-y-6 border border-white/10 p-6">
            <h3 className="text-2xl">What's different in 2025?</h3>
            <p className="text-white/70">
              We built an interactive storyline powered by QR hunts, responsive lighting, and localized audio beacons. Parallax
              visuals keep the illusion alive: floors sway, sigils breathe, and signage flickers like an open gate.
            </p>
          </div>
        </div>

        <div className="space-y-6 border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Field Log</p>
          <div className="space-y-8">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.1 }}
                className="border border-white/10 p-5"
              >
                <h4 className="text-lg uppercase tracking-[0.2em] text-red-200">{item.title}</h4>
                <p className="text-sm leading-relaxed text-white/70">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-xs uppercase tracking-[0.6em] text-white/40">Stay curious • Stay inverted</div>
        </div>
      </div>
    </section>
  )
}
