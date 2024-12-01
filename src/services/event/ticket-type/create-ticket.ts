/* eslint-disable camelcase */
import api from '../../api'
import { toast } from 'sonner'

export type CreateEventTicketTypeResponseType = {
  eventTicketTypeId: string
  message?: string
  success?: boolean
}

export type CreateEventTicketTypeResponseApiType = {
  data: {
    ticketTypeId: string
  }
}

export type EventTypesType = {
  amount: number
  price: string
  isActive: boolean
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  eventId: string
  title: string
}

export type CreateEventTypeRequest = EventTypesType

export const createEventTicketType = async ({
  amount,
  price,
  isActive,
  startDate,
  endDate,
  startTime,
  endTime,
  eventId,
  title,
}: CreateEventTypeRequest): Promise<CreateEventTicketTypeResponseType> => {
  try {
    const data = {
      amount,
      price,
      isActive,
      startDate,
      endDate,
      startTime,
      endTime,
      eventId,
      title,
      description: '',
    }

    const response: CreateEventTicketTypeResponseApiType = await api.post(
      '/event/ticket-type',
      data,
    )

    return {
      eventTicketTypeId: response.data.ticketTypeId,
      success: true,
    }
  } catch (error: unknown) {
    toast.error(
      'Ocorreu um erro ao cadastrar o ingresso, tente novamente mais tarde!',
    )
    return {
      eventTicketTypeId: '',
      message:
        'Ocorreu um erro ao cadastrar o ingresso, tente novamente mais tarde!',
      success: false,
    }
  }
}
