import { useNavigate } from 'react-router-dom'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import { PencilIcon, Plus } from 'lucide-react'
import { ticketTypes } from '../../../../services/event'
import { formatCurrency } from '../../../../utils/functions'

type TicketManagementDialogProps = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  eventTicket: ticketTypes[]
  eventId: string
}

export function TicketManagementDialog({
  isOpen,
  setIsOpen,
  eventTicket,
  eventId,
}: TicketManagementDialogProps) {
  const navigate = useNavigate()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Ingressos desse evento</DialogTitle>
            <Button
              size="sm"
              onClick={() => navigate(`/b2b/event/${eventId}/create-ticket`)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Ingresso
            </Button>
          </div>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NOME</TableHead>
              <TableHead>VENDIDOS/TOTAL</TableHead>
              <TableHead>VALOR DO INGRESSO</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventTicket.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  {ticket.quantitySold}/{ticket.amount}
                </TableCell>
                <TableCell>R$ {formatCurrency(ticket.price)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate(`/b2b/event/${ticket.id}/edit-ticket`)
                    }
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
