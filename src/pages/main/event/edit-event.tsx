import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import EventEditForm from './components/event-edit-form'
import { EventType, getEventById } from '../../../services/event'
import { ScreenLoading } from '../../../components/screen-loading'

export function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<EventType | null>(null)
  const [loadingEvent, setLoadingEvent] = useState(true)

  const fetchEvent = async () => {
    const { event, success } = await getEventById({ eventId: eventId || '' })
    if (success && event) {
      setEvent(event)
    }
    setLoadingEvent(false)
  }

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  if (loadingEvent) {
    return <ScreenLoading />
  }

  return (
    <div className="mx-auto w-full px-4">
      <h1 className="my-8 text-2xl font-bold">Edit Event</h1>
      {event && <EventEditForm event={event} />}
    </div>
  )
}
