'use client'

import { useEffect, useState } from 'react'
import IntroVideo from '../components/IntroVideo'
import SmoothScroll from '../components/SmoothScroll'
import Navigation from '../components/Navigation'
import Footer from '../components/sections/Footer'
import Oneko from '../components/Oneko'

const INTRO_KEY = 'abhisarga_intro_timestamp'
const INTRO_COOLDOWN = 100000 * 60 // same cooldown as Vite app

export default function ClientShell({ children }) {
  const [booted, setBooted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    // Suppress removeChild errors globally
    const originalError = console.error
    console.error = (...args) => {
      const errorMessage = args[0]?.toString() || ''
      
      // Suppress specific React Three Fiber / Canvas related errors
      if (
        errorMessage.includes('removeChild') ||
        errorMessage.includes('not a child of this node') ||
        errorMessage.includes('Failed to execute \'removeChild\' on \'Node\'')
      ) {
        // Silently ignore these errors
        return
      }
      
      // Log all other errors normally
      originalError.apply(console, args)
    }

    // Also handle uncaught errors
    const handleError = (event) => {
      const errorMessage = event.error?.message || event.message || ''
      if (
        errorMessage.includes('removeChild') ||
        errorMessage.includes('not a child of this node')
      ) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener('error', handleError)

    return () => {
      console.error = originalError
      window.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const timestamp = localStorage.getItem(INTRO_KEY)
    if (timestamp) {
      const elapsed = Date.now() - Number(timestamp)
      if (elapsed < INTRO_COOLDOWN) {
        setShowIntro(false)
      }
    }

    setBooted(true)
  }, [])

  const handleIntroComplete = () => {
    localStorage.setItem(INTRO_KEY, Date.now().toString())
    setShowIntro(false)
  }

  if (!booted) return null

  if (showIntro) {
    return <IntroVideo onComplete={handleIntroComplete} />
  }

  return (
    <SmoothScroll>
      <Oneko />
      <Navigation />
      <main className="pt-0 min-h-screen">{children}</main>
      <Footer />
    </SmoothScroll>
  )
}
