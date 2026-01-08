'use client'

import { motion } from "framer-motion"
import { sponsorTiers } from "../data/content"

export default function Sponsors() {
  return (
    <section id="sponsors" className="relative overflow-hidden px-4 py-32">
      <div className="absolute inset-0 bg-linear-to-b from-black via-red-500/5 to-black" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 10%, rgba(255,37,70,0.25), transparent 50%)" }} />

      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-red-200">Allies</p>
          <h2 className="mt-4 text-5xl">Sponsors</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm uppercase tracking-[0.3em] text-white/60">
            The forces keeping the portal stable
          </p>
        </div>

        <div className="grid gap-8">
          {sponsorTiers.map((tier, idx) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-white/10 bg-black/40 p-6 backdrop-blur"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-3xl uppercase tracking-[0.3em] text-red-200">{tier.tier}</h3>
                <span className="text-xs uppercase tracking-[0.4em] text-white/50">{tier.sponsors.length} Partners</span>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {tier.sponsors.map((sponsor) => (
                  <div key={sponsor.name} className="border border-white/5 p-4 text-center">
                    <p className="text-lg uppercase tracking-[0.3em]">{sponsor.name}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.4em] text-red-200">{sponsor.tag}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="mailto:abhisarga@iiits.in"
            className="inline-flex items-center justify-center border border-white/20 px-12 py-4 text-xs uppercase tracking-[0.4em] text-white/80 transition hover:border-white/60 hover:text-white"
          >
            Become an Ally
          </a>
        </div>
      </div>
    </section>
  )
}
