/* eslint-disable camelcase */
import api from '../api'
import { toast } from 'sonner'

export type UpdateEventResponseType = {
  message?: string
  success?: boolean
}

export type UpdateEventResponseApiType = {
  data: {
    success: boolean
  }
}

export type UpdateEventRequest = {
  title?: string
  isActive?: boolean
  description?: string
  imageUrl?: string
  startDate?: string
  startTime?: string
  endDate?: string
  endTime?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
  eventId: string
}

export const updateEvent = async ({
  title,
  description,
  imageUrl,
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
  isActive,
  eventId,
}: UpdateEventRequest): Promise<UpdateEventResponseType> => {
  try {
    const data = {
      title,
      description,
      date: startDate,
      isActive,
      imageUrl,
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
      eventId,
    }

    const response: UpdateEventResponseApiType = await api.patch('/event', data)

    return {
      success: response.data.success,
    }
  } catch (error: unknown) {
    toast.error(
      'Ocorreu um erro ao atualizar o evento, tente novamente mais tarde.',
    )
    return {
      message:
        'Ocorreu um erro ao cadastrar o evento, tente novamente mais tarde!',
      success: false,
    }
  }
}
