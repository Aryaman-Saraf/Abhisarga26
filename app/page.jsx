import PortalPulse from "../components/PortalPulse"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import EventTimelineSection from "../components/sections/EventTimeline"
import Sponsors from "../components/sections/Sponsors"
import Team from "../components/sections/Team"
import Gallery from "../components/sections/Gallery"

export default function Page() {
  return (
    <>
      <PortalPulse />
      <Hero />
      <About />
      <EventTimelineSection />
      <Sponsors />
      <Team />
      <Gallery />
    </>
  )
}
