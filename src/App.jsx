import { useEffect, useState } from "react"
import IntroVideo from "./components/IntroVideo"
import SmoothScroll from "./components/SmoothScroll"
import Navigation from "./components/Navigation"
import Hero from "./sections/Hero"
import About from "./sections/About"
import Events from "./sections/Events"
import Schedule from "./sections/Schedule"
import EventTimelineSection from "./sections/EventTimeline"
import Sponsors from "./sections/Sponsors"
import Team from "./sections/Team"
import Gallery from "./sections/Gallery"
import Footer from "./sections/Footer"
import PortalPulse from "./components/PortalPulse"

const INTRO_KEY = "abhisarga_intro_timestamp"
const INTRO_COOLDOWN =1000

export default function App() {
  const [booted, setBooted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

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
      <div className="relative min-h-screen bg-[#030204] text-white">
        <PortalPulse />
        <Navigation />
        <Hero />
        <About />
        <Events />
        <Schedule />
        <EventTimelineSection />
        <Sponsors />
        <Team />
        <Gallery />
        <Footer />
      </div>
    </SmoothScroll>
  )
}
