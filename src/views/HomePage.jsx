import PortalPulse from "../components/PortalPulse"
import Hero from "../sections/Hero"
import About from "../sections/About"
import Events from "../sections/Events"
import Schedule from "../sections/Schedule"
import Sponsors from "../sections/Sponsors"
import Team from "../sections/Team"
import Gallery from "../sections/Gallery"

export default function HomePage() {
  return (
    <>
      <PortalPulse />
      <Hero />
      <About />
      <Events />
      <Schedule />
      <Sponsors />
      <Team />
      <Gallery />
    </>
  )
}
