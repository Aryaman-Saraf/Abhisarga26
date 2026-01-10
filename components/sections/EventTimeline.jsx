import EventTimeline from "../EventTimeline"
import { eventTimelineData } from "../../lib/content"

export default function EventTimelineSection() {
  return (
    <section id="schedule" className="relative">
      <EventTimeline events={eventTimelineData} />
    </section>
  )
}

