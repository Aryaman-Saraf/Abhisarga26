import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const VIDEO_DURATION = 30000 // fallback duration in ms for opacity animation sync

export default function IntroVideo({ onComplete }) {
  const videoRef = useRef(null)
  const [isEnding, setIsEnding] = useState(false)
  const [needsInteraction, setNeedsInteraction] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let interactionHandler

    const tryPlay = async () => {
      try {
        await video.play()
      } catch (error) {
        setNeedsInteraction(true)
        // video.muted = true
        // try {
        //   await video.play()
        // } catch (err) {
        //   // ignore
        // }

        interactionHandler = () => {
          video.muted = false
          video.play().catch(() => {})
          setNeedsInteraction(false)
        }

        document.addEventListener("click", interactionHandler, { once: true })
      }
    }

    tryPlay()

    const fallbackTimeout = setTimeout(() => {
      if (!isEnding) {
        handleComplete()
      }
    }, VIDEO_DURATION + 2000)

    return () => {
      if (interactionHandler) {
        document.removeEventListener("click", interactionHandler)
      }
      clearTimeout(fallbackTimeout)
    }
  }, [])

  const handleComplete = () => {
    setIsEnding(true)
    setTimeout(() => onComplete(), 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isEnding ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-black flex"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        onEnded={handleComplete}
        poster="/video/intro-poster.jpg"
      >
        <source src="/video/intro.mp4" type="video/mp4" />
      </video>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center space-y-4">
        {needsInteraction && (
          <p className="text-xs tracking-[0.4em] uppercase text-red-400">Tap anywhere to unmute</p>
        )}
        <button
          onClick={handleComplete}
          className="px-8 py-3 border border-red-500/50 text-xs tracking-[0.5em] uppercase text-red-200 hover:text-white hover:border-red-400 transition-colors"
        >
          Skip Intro
        </button>
      </div>
    </motion.div>
  )
}
