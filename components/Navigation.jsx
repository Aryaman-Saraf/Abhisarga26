'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const links = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Schedule" },
  { href: "/sponsors", label: "Allies", isRoute: true },
  { href: "/crew", label: "Crew", isRoute: true },
  { href: "#faq", label: "FAQ" },
  { href: "/contact", label: "Contact", isRoute: true },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const listener = () => {
      setScrolled(window.scrollY > 40)
    }
    listener()
    window.addEventListener("scroll", listener)
    return () => window.removeEventListener("scroll", listener)
  }, [])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener("hashchange", close)
    return () => window.removeEventListener("hashchange", close)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-black/70 border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-sm uppercase tracking-[0.6em] text-red-200 hover:text-white">
          ABHISARGA'26
        </Link>

        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.4em] md:flex">
          {links.map((link) => (
            link.isRoute ? (
              <Link key={link.href} href={link.href} className="text-white/70 hover:text-white">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="text-white/70 hover:text-white">
                {link.label}
              </a>
            )
          ))}
        </nav>

        <button
          className="md:hidden text-white text-sm tracking-[0.5em]"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="md:hidden border-t border-white/5 bg-black/90 px-4 py-6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.5em]">
              {links.map((link) => (
                link.isRoute ? (
                  <Link key={link.href} href={link.href} className="text-white/80" onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.href} href={link.href} className="text-white/80" onClick={() => setOpen(false)}>
                    {link.label}
                  </a>
                )
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
