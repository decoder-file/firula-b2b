import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'
import { Button } from './ui/button'
import { FileTextIcon, ArrowRight } from 'lucide-react'

interface PaymentPendency {
  type: string
  title: string
  urlOnboarding: string
}

interface PaymentActivationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: PaymentPendency[]
}

export default function PaymentActivationModal({
  open,
  onOpenChange,
  data,
}: PaymentActivationModalProps) {
  const [pendencies] = useState<PaymentPendency[]>(data)
  console.log(pendencies)

  const handleActionClick = (actionUrl: string) => {
    window.open(actionUrl, '_blank', 'noopener,noreferrer')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ativação de pagamentos</DialogTitle>
          <DialogDescription>
            Complete os itens abaixo para ativar os pagamentos na plataforma
            Firula
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            {pendencies.map((pendency) => (
              <div
                key={pendency.type}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <FileTextIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{pendency.title}</h4>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick(pendency.urlOnboarding)}
                  className="ml-2"
                >
                  Ajustar
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
