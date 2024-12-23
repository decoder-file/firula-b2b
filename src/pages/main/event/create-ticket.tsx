import * as React from 'react'
import { toast } from 'sonner'
import { useState } from 'react'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

import { Button } from '../../../components/ui/button'
import { Calendar } from '../../../components/ui/calendar'
import { Input } from '../../../components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'
import { Switch } from '../../../components/ui/switch'
import { cn } from '../../../lib/utils'
import { createEventTicketType, EventTypesType } from '../../../services/event'

export function CreateTicketPage() {
  const navigate = useNavigate()
  const { eventId } = useParams<{ eventId: string }>()

  const [title, setTitle] = useState('')
  const [quantity, setQuantity] = useState('')
  const [value, setValue] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [endTime, setEndTime] = useState('')

  const [loadingCreateTicket, setLoadingCreateTicket] = useState(false)

  const [isVisible, setIsVisible] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    setLoadingCreateTicket(true)
    e.preventDefault()
    const formData: EventTypesType = {
      amount: Number(quantity),
      price: value,
      isActive: isVisible,
      startDate: moment(startDate).toDate(),
      endDate: moment(endDate).toDate(),
      startTime,
      endTime,
      eventId: eventId || '',
      title,
    }

    const response = await createEventTicketType(formData)

    if (response.success) {
      toast.success('Ingresso criado com sucesso')
      navigate(`/b2b/list-events`)

      setLoadingCreateTicket(false)
      return
    }

    setLoadingCreateTicket(false)
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Criar ingresso</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 rounded-lg bg-muted/50 p-4 text-sm">
            A taxa de serviço é repassada ao comprador, sendo exibida junto com
            o valor do ingresso
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Título do ingresso
              </label>
              <Input
                id="title"
                placeholder="Ingresso único, Meia-Entrada, VIP, etc."
                className="mt-1"
                input={{
                  change: (val: string) => setTitle(val),
                  value: title,
                }}
              />
              <p className="mt-1 text-sm text-gray-700">
                {45 - title.length} caracteres restantes
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium "
                >
                  Quantidade
                </label>
                <Input
                  id="quantity"
                  placeholder="Ex. 100"
                  className="mt-1"
                  input={{
                    change: (val: string) => setQuantity(val),
                    value: quantity,
                  }}
                />
              </div>
              <div>
                <label htmlFor="value" className="block text-sm font-medium">
                  Valor a receber
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5">R$</span>
                  <Input
                    id="value"
                    className="pl-10"
                    placeholder="0,00"
                    input={{
                      change: (val: string) => setValue(val),
                      value,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Período das vendas deste ingresso:
              </label>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">
                    Data de Início das Vendas
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'mt-1 w-full pl-3 text-left font-normal',
                          !startDate && 'text-muted-foreground',
                        )}
                      >
                        {startDate ? (
                          format(startDate, 'P', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium"
                  >
                    Hora de Início
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="startTime"
                      type="time"
                      input={{
                        change: (val: string) => setStartTime(val),
                        value: startTime,
                      }}
                    />
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Horário de Brasília
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Término das Vendas
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'mt-1 w-full pl-3 text-left font-normal',
                          !endDate && 'text-muted-foreground',
                        )}
                      >
                        {endDate ? (
                          format(endDate, 'P', { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hora de Término
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="endTime"
                      type="time"
                      input={{
                        change: (val: string) => setEndTime(val),
                        value: endTime,
                      }}
                    />
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Horário de Brasília
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-base font-medium">
                  Visibilidade do ingresso
                </label>
              </div>
              <Switch checked={isVisible} onCheckedChange={setIsVisible} />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/b2b/list-events')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loadingCreateTicket}>
                Criar ingresso
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
