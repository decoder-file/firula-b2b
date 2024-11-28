/* eslint-disable camelcase */
import api from '../api'
import { toast } from 'sonner'
import { CreateEventRequestType } from './event-type'

export type CreateEventResponseType = {
  eventId: string
  message?: string
  success?: boolean
}

export type CreateEventResponseApiType = {
  data: {
    eventId: string
  }
}

export type CreateEventRequest = CreateEventRequestType

export const createEvent = async ({
  title,
  description,
  imageUrl,
  companyId,
  startDate,
  startTime,
  endDate,
  endTime,
  street,
  number,
  complement,
  neighborhood,
  city,
  state,
  zipCode,
}: CreateEventRequest): Promise<CreateEventResponseType> => {
  try {
    const data = {
      title,
      description,
      date: startDate,
      isActive: false,
      imageUrl,
      companyId,
      startDate,
      startTime,
      endDate,
      endTime,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
    }

    const response: CreateEventResponseApiType = await api.post('/event', data)

    return {
      eventId: response.data.eventId,
      success: true,
    }
  } catch (error: unknown) {
    toast.error(
      'Ocorreu um erro ao cadastrar o evento, tente novamente mais tarde!',
    )
    return {
      eventId: '',
      message:
        'Ocorreu um erro ao cadastrar o evento, tente novamente mais tarde!',
      success: false,
    }
  }
}
