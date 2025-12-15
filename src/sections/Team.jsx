import { motion } from "framer-motion"
import { teamCategories } from "../data/content"

export default function Team() {
  return (
    <section id="team" className="relative px-4 py-32">
      <div className="absolute inset-0 bg-linear-to-b from-black via-black to-red-500/5" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-red-200">Handlers</p>
          <h2 className="mt-4 text-5xl">Team</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm uppercase tracking-[0.3em] text-white/60">
            People steering the Upside Down immersion
          </p>
        </div>

        {teamCategories.map((category, idx) => (
          <div key={category.category} className="space-y-8">
            <h3 className="text-3xl uppercase tracking-[0.3em] text-red-200">{category.category}</h3>
            <div className="grid gap-6 md:grid-cols-4">
              {category.members.map((member, memberIndex) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.05 + memberIndex * 0.05 }}
                  className="group overflow-hidden border border-white/10"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-110 group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                  <div className="border-t border-white/5 p-4">
                    <p className="text-lg uppercase tracking-[0.2em]">{member.name}</p>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/50">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
