import PortalPulse from "../components/PortalPulse"
import Hero from "../components/sections/Hero"
import About from "../components/sections/About"
import Events from "../components/sections/Events"
import EventTimelineSection from "../components/sections/EventTimeline"
import Sponsors from "../components/sections/Sponsors"
import Team from "../components/sections/Team"
import Gallery from "../components/sections/Gallery"
import FAQ from "../components/sections/FAQ"

export default function Page() {
  return (
    <>
      <PortalPulse />
      <Hero />
      <About />
      <Events />
      <EventTimelineSection />
      <Sponsors />
      <Team />
      <Gallery />
      <FAQ />
    </>
  )
}
