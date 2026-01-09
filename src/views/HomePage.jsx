import PortalPulse from "../components/PortalPulse"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import Events from "../components/sections/Events"
// import Schedule from "../components/sections/Schedule"
import EventTimelineSection from "../components/sections/EventTimeline"
import Sponsors from "../components/sections/Sponsors"
import Team from "../components/sections/Team"
import Gallery from "../components/sections/Gallery"

export default function HomePage() {
  return (
    <>
      <PortalPulse />
      <Hero />
      <About />
      <Events />
      {/* <Schedule /> */}
      <EventTimelineSection />
      <Sponsors />
      <Team />
      <Gallery />
    </>
  )
}
