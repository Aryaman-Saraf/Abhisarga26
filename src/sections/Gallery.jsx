import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { galleryImages } from "../data/content"

export default function Gallery() {
  const [active, setActive] = useState(null)

  return (
    <section id="gallery" className="relative px-4 py-32">
      <div className="absolute inset-0 bg-linear-to-b from-black via-red-500/5 to-black" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-red-200">Echoes</p>
          <h2 className="mt-4 text-5xl">Gallery</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm uppercase tracking-[0.3em] text-white/60">
            Snapshots from the realm
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {galleryImages.map((image, idx) => (
            <motion.button
              key={image.src}
              onClick={() => setActive(image)}
              className="group relative aspect-4/3 overflow-hidden border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.05 }}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-110 group-hover:grayscale-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 transition group-hover:opacity-100" />
              <span className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.4em] text-white">View</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.img
              src={active.src}
              alt={active.alt}
              className="max-w-4xl object-contain"
              style={{ maxHeight: "80vh" }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
            <button className="absolute right-8 top-8 text-2xl tracking-[0.6em] text-white" onClick={() => setActive(null)}>
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
