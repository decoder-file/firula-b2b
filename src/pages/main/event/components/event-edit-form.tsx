import { useState } from 'react'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { Switch } from '../../../../components/ui/switch'
import { Label } from '../../../../components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'

export default function EventEditForm() {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isActive: false,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setEventData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(JSON.stringify(eventData))
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full space-y-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Dados do evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Digite o titulo do evento"
              input={{
                change: handleInputChange,
                value: eventData.title,
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Digite a descrição do evento"
              value={eventData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              input={{
                change: handleInputChange,
                value: eventData.imageUrl,
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={eventData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">
              {eventData.isActive ? 'Desativar evento' : 'Ativar Evento'}
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data do evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de inicio</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                input={{
                  change: handleInputChange,
                  value: eventData.startDate,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de termino</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
                input={{
                  change: handleInputChange,
                  value: eventData.endDate,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário de inicio</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                required
                input={{
                  change: handleInputChange,
                  value: eventData.startTime,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Horário de termino </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                required
                input={{
                  change: handleInputChange,
                  value: eventData.endTime,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço do evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              name="street"
              required
              input={{
                change: handleInputChange,
                value: eventData.street,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Numero</Label>
              <Input
                id="number"
                name="number"
                required
                input={{
                  change: handleInputChange,
                  value: eventData.number,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                name="complement"
                input={{
                  change: handleInputChange,
                  value: eventData.complement,
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              required
              input={{
                change: handleInputChange,
                value: eventData.neighborhood,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                required
                input={{
                  change: handleInputChange,
                  value: eventData.city,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                name="state"
                required
                input={{
                  change: handleInputChange,
                  value: eventData.state,
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              name="zipCode"
              required
              input={{
                change: handleInputChange,
                value: eventData.zipCode,
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Salvar Evento
      </Button>
    </form>
  )
}
