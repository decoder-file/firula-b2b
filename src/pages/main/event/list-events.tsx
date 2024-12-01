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
import { useState } from 'react'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
}

const events: Event[] = [
  {
    id: '1',
    title: 'Réveillon WA 2025',
    date: 'TER, 31 DEZ',
    time: '20:00',
    location: 'Av. Getúlio Vargas, 1300 - Belo Horizonte, MG',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: '2',
    title: 'Summer Sports Festival',
    date: 'SAB, 15 JAN',
    time: '14:00',
    location: 'Parque Municipal - Belo Horizonte, MG',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: '3',
    title: 'Tennis Tournament 2025',
    date: 'DOM, 20 JAN',
    time: '09:00',
    location: 'Clube Atlético - Belo Horizonte, MG',
    image: '/placeholder.svg?height=200&width=400',
  },
]

export function ListEventsPage() {
  const navigate = useNavigate()

  const [isOpenModalTicket, setIsOpenModalTicket] = useState(false)

  const openEventLink = () => {
    window.open(
      `${import.meta.env.VITE__APP_B2C_URL}evento/3124`,
      '_blank',
      'noopener,noreferrer',
    )
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
                src={ImagemBackground}
                alt={event.title}
                className="h-48 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="mb-2 text-2xl font-semibold">{event.title}</h2>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-primary">
                  {event.date} • {event.time}
                </p>
                <p>{event.location}</p>
              </div>
            </CardContent>
            <CardFooter className="gap-4 p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/b2b/edit-event`)}
              >
                <Edit className="mr-2 h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={openEventLink}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => navigate(`/b2b/event/1234/dashboard`)}
              >
                <ChartColumn className="mr-2 h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setIsOpenModalTicket(true)}
              >
                <Tickets className="mr-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        <TicketManagementDialog
          isOpen={isOpenModalTicket}
          setIsOpen={setIsOpenModalTicket}
        />
      </div>
    </div>
  )
}
