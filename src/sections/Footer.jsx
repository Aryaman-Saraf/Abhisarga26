export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/10 px-4 py-16">
      <div className="absolute inset-0 bg-linear-to-b from-black to-red-500/5" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-8 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-red-200">Contact</p>
        <h3 className="text-3xl">Abhisarga • Upside Down</h3>
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">
          IIIT Sri City • Chittoor, Andhra Pradesh • abhisarga@iiits.in • +91 1234567890
        </p>
        <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-[0.5em] text-white/60">
          {"Instagram Twitter YouTube LinkedIn".split(" ").map((social) => (
            <a key={social} href="https://abhisarga-iiits.in" target="_blank" rel="noreferrer" className="hover:text-white">
              {social}
            </a>
          ))}
        </div>
        <p className="text-[0.6rem] uppercase tracking-[0.6em] text-white/40">© 2025 IIIT Sri City • Stay inverted</p>
      </div>
    </footer>
  )
}
