import { Button } from '../../../components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../../../components/ui/card'
import { ChartColumn, Edit, ExternalLink, Tickets } from 'lucide-react'
import ImagemBackground from '../../../assets/mock/imagem-background.png'
import { useNavigate } from 'react-router-dom'
import { TicketManagementDialog } from './components/ticket-management'
import { useEffect, useState } from 'react'
import { EventType, getEvents } from '../../../services/event'
import { useUserStore } from '../../../store/UserStore'
import { ScreenLoading } from '../../../components/screen-loading'
import moment from 'moment'

export function ListEventsPage() {
  const navigate = useNavigate()
  const { user } = useUserStore()

  const [isOpenModalTicket, setIsOpenModalTicket] = useState(false)
  const [events, setEvents] = useState<EventType[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [eventSelected, setEventSelected] = useState<EventType | null>(null)

  const fetchEvents = async () => {
    setLoadingEvents(true)
    const response = await getEvents({ companyId: user.companyId || '' })
    if (response.success && response.events) {
      setEvents(response.events)
    }
    setLoadingEvents(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const openEventLink = (eventSlug: string) => {
    window.open(
      `${import.meta.env.VITE__APP_B2C_URL}evento/${eventSlug}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleClickManagerTicket = (id: string) => {
    setEventSelected(events.find((event) => event.id === id) || null)
    setIsOpenModalTicket(true)
  }

  if (loadingEvents) {
    return <ScreenLoading />
  }

  return (
    <div className="mx-auto w-full py-2">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold">Meus Eventos</h1>
        <Button onClick={() => navigate(`/b2b/create-event`)}>
          Criar Novo Evento
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <img
                src={
                  event.imageUrl
                    ? `https://pub-ed847887b3d7415384bbf5488c674561.r2.dev/${event.imageUrl}`
                    : ImagemBackground
                }
                alt={event.title}
                className="h-48 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="mb-2 text-2xl font-semibold">{event.title}</h2>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-primary">
                  {moment(event.startDate).format('DD/MM/YYYY')} •{' '}
                  {event.startTime}
                </p>
                <p>{`${event?.street}, ${event?.number} - ${event?.neighborhood}, ${event?.city} - ${event?.state}`}</p>
              </div>
            </CardContent>
            <CardFooter className="gap-4 p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/b2b/edit-event/${event.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => openEventLink(event.slug)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => navigate(`/b2b/event/${event.id}/dashboard`)}
              >
                <ChartColumn className="mr-2 h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => handleClickManagerTicket(event.id)}
              >
                <Tickets className="mr-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        <TicketManagementDialog
          isOpen={isOpenModalTicket}
          setIsOpen={setIsOpenModalTicket}
          eventTicket={eventSelected?.ticketTypes || []}
          eventId={eventSelected?.id || ''}
        />
      </div>
    </div>
  )
}
