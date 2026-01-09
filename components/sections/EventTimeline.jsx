import EventTimeline from "../EventTimeline"
import { eventTimelineData } from "../../lib/content"

export default function EventTimelineSection() {
  return (
    <section id="event-timeline" className="relative">
      <EventTimeline events={eventTimelineData} />
    </section>
  )
}

