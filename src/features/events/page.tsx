import { EventsHero } from "./EventsHero"
import { UpcomingEvents } from "../home/sections/UpcomingEvents"
import { EventCarousel } from "../home/sections/EventCarousel"


const EventsPage = () => {
  return (
    <>
    <EventsHero />
    <div id="UpcomingEvents">
      <UpcomingEvents />
    </div>
    <EventCarousel />
    </>

  )
}

export default EventsPage