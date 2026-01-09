'use client'

import { motion } from "framer-motion"
import { scheduleTimeline } from "../../lib/content"

export default function Schedule() {
  return (
    <section id="schedule" className="relative px-4 py-32">
      <div className="absolute inset-0 bg-linear-to-b from-black via-black to-red-500/5" />
      <div
        className="absolute inset-x-0 top-20 mx-auto rounded-full bg-red-500/5 blur-3xl"
        style={{ width: "600px", height: "600px" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-red-200">Sequence</p>
          <h2 className="mt-4 text-5xl">Schedule</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm uppercase tracking-[0.3em] text-white/60">
            Every day escalates until the portal seals
          </p>
        </div>

        <div className="space-y-12">
          {scheduleTimeline.map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.15 }}
              className="border border-white/10 bg-black/40 p-6 backdrop-blur"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.6em] text-white/50">{day.day}</p>
                  <h3 className="text-3xl text-red-200">{day.date}</h3>
                </div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">{day.highlights}</p>
              </div>

              <div className="mt-6 grid gap-4">
                {day.events.map((event) => (
                  <div key={`${event.title}-${event.time}`} className="grid gap-4 border border-white/5 p-4 md:grid-cols-[120px_2fr_1fr]">
                    <div className="text-sm font-mono tracking-[0.4em] text-red-200">{event.time}</div>
                    <div>
                      <p className="text-lg uppercase tracking-[0.2em]">{event.title}</p>
                    </div>
                    <div className="text-sm uppercase tracking-[0.3em] text-white/60">{event.location}</div>
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
