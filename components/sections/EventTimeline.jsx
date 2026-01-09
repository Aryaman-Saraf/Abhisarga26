import { EventTimeline } from "../components/EventTimeline"
import { eventTimelineData } from "../data/content"

export default function EventTimelineSection() {
  return (
    <section id="event-timeline" className="relative">
      <EventTimeline events={eventTimelineData} />
    </section>
  )
}

