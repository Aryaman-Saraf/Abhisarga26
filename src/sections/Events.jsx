import { motion } from "framer-motion"
import { eventCategories } from "../data/content"

export default function Events() {
  return (
    <section id="events" className="relative overflow-hidden px-4 py-32">
      <div className="absolute inset-0 bg-linear-to-b from-black via-red-500/5 to-black" />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(120deg, transparent 0%, rgba(255,37,70,0.2) 50%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-6xl space-y-16">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-red-200">Choose your distortion</p>
          <h2 className="mt-4 text-5xl">Events</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm uppercase tracking-[0.3em] text-white/60">
            Layered arenas where code, rhythm, and lore overlap
          </p>
        </div>

        <div className="grid gap-10">
          {eventCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.15 }}
              className="border border-white/10 bg-white/5 px-6 py-8 backdrop-blur"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-3xl uppercase tracking-[0.3em] text-red-200">{category.category}</h3>
                <span className="text-xs uppercase tracking-[0.5em] text-white/50">{category.events.length} signals</span>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {category.events.map((event) => (
                  <div key={event.name} className="group border border-white/5 bg-black/40 p-5 transition hover:border-red-400/40">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-xl uppercase tracking-[0.2em]">{event.name}</h4>
                      <span className="text-[0.65rem] tracking-[0.5em] text-red-200">SYNC</span>
                    </div>
                    <p className="mt-3 text-sm text-white/70">{event.description}</p>
                    <div className="mt-5 text-xs uppercase tracking-[0.4em] text-red-300 opacity-0 transition group-hover:opacity-100">
                      Tap to decode →
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
