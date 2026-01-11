import PortalPulse from "../components/PortalPulse"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import Events from "../components/sections/Events"
import EventTimelineSection from "../components/sections/EventTimeline"
import Team from "../components/sections/Team"

export default function Page() {
  return (
    <>
      <PortalPulse />
      <Hero />
      <About />
      <Events />
      <EventTimelineSection />
      <Team />
    </>
  )
}
