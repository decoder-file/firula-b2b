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

interface Ticket {
  id: string
  type: string
  soldTotal: string
  amount: number
  fee: number
  visible: boolean
}

const tickets: Ticket[] = [
  {
    id: '1',
    type: 'Ingresso teste 01',
    soldTotal: '0/100',
    amount: 200.0,
    fee: 20.0,
    visible: true,
  },
]

type TicketManagementDialogProps = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export function TicketManagementDialog({
  isOpen,
  setIsOpen,
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
              onClick={() => navigate(`/b2b/event/2434/create-ticket`)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Ingresso
            </Button>
          </div>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TIPO</TableHead>
              <TableHead>VENDIDOS/TOTAL</TableHead>
              <TableHead>VALOR DO INGRESSO</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.type}</TableCell>
                <TableCell>{ticket.soldTotal}</TableCell>
                <TableCell>R$ {ticket.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/b2b/event/758/edit-ticket')}
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
