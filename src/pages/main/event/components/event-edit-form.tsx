import { useState } from 'react'
import { toast } from 'sonner'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

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
import { EventType } from '../../../../services/event'
import {
  updateEvent,
  UpdateEventRequest,
} from '../../../../services/event/update-event'
import { GetUrlImageType } from '../../../../services/image'
import { getUrlImage } from '../../../../services/image/get-url-image'
import axios from 'axios'

type EventEditFormProps = {
  event: EventType
}

export default function EventEditForm({ event }: EventEditFormProps) {
  const navigate = useNavigate()

  const [imageUrl, setImageUrl] = useState<FileList | null>(null)

  const [eventData, setEventData] = useState({
    title: event.title,
    description: event.description,
    imageUrl: event.imageUrl,
    isActive: event.isActive,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    street: event.street,
    number: event.number,
    complement: event.complement,
    neighborhood: event.neighborhood,
    city: event.city,
    state: event.state,
    zipCode: event.zipCode,
  })
  const [loadingUpdate, setLoadingUpdate] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setEventData((prev) => ({ ...prev, isActive: checked }))
  }

  function handleChoseImage(e: React.ChangeEvent<HTMLInputElement>) {
    setImageUrl(e.target.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setLoadingUpdate(true)
    e.preventDefault()

    if (
      imageUrl &&
      imageUrl[0].type !== 'image/png' &&
      imageUrl[0].type !== 'image/jpg'
    ) {
      toast.error('A imagem deve ser do tipo PNG ou JPG.')
      setLoadingUpdate(false)
      return
    }

    let imageBlock = ''
    if (imageUrl) {
      const responseImage: GetUrlImageType = (await getUrlImage(
        eventData.title.replace(/\s/g, '') + '_event',
      )) as GetUrlImageType

      imageBlock = responseImage.data.url

      await axios.put(responseImage.data.signedUrl, imageUrl[0], {
        headers: {
          'Content-Type': 'image/png',
        },
      })
    }

    const data: UpdateEventRequest = {
      ...eventData,
      imageUrl: imageUrl ? imageBlock : eventData.imageUrl,
      startDate: moment(eventData.startDate).format('YYYY-MM-DD'),
      endDate: moment(eventData.endDate).format('YYYY-MM-DD'),
      eventId: event.id,
    }

    const response = await updateEvent(data)

    if (response.success) {
      navigate(`/b2b/list-events`)
      toast.success('Evento atualizado com sucesso!')
      setLoadingUpdate(false)

      return
    }

    setLoadingUpdate(false)
  }

  function handleDeleteBanner() {
    setImageUrl(null)
    setEventData((prev) => ({ ...prev, imageUrl: '' }))
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
            <div className="flex w-full items-center justify-between">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Button
                type="button"
                variant="link"
                className="text-red-500"
                onClick={handleDeleteBanner}
              >
                Remover banner
              </Button>
            </div>
            <div className="mb-2 flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  {imageUrl ? (
                    <img
                      src={URL.createObjectURL(imageUrl[0])}
                      alt="Logo Firula"
                      className="h-20 w-20"
                    />
                  ) : (
                    <img
                      src={`https://pub-ed847887b3d7415384bbf5488c674561.r2.dev/${eventData.imageUrl}`}
                      alt="Logo Firula"
                      className="h-20 w-20"
                    />
                  )}

                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      {eventData.imageUrl
                        ? 'Clique para alterar a imagem'
                        : 'Clique para carregar'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG ou JPG (MAX. 400x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  onChange={handleChoseImage}
                  className="hidden"
                />
              </label>
            </div>
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
                  value: moment(eventData.startDate).format('YYYY-MM-DD'),
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
                  value: moment(eventData.endDate).format('YYYY-MM-DD'),
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

      <Button
        type="submit"
        className="w-full"
        disabled={loadingUpdate}
        loading={loadingUpdate}
      >
        Salvar Evento
      </Button>
    </form>
  )
}
