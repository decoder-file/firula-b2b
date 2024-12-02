/* eslint-disable camelcase */
import api from '../../api'
import { toast } from 'sonner'

export type TicketType = {
  id: string
  title: string
  description: string
  amount: number
  quantitySold: number
  price: string
  isActive: boolean
  startDate: Date
  endDate: Date
  endTime: string
  startTime: string
  createdAt: Date
  updatedAt: Date
  eventId: string
}

export type GetEventTicketTypeResponseType = {
  ticketType?: TicketType
  message?: string
  success?: boolean
}

export type GetEventTicketTypeResponseApiType = {
  data: {
    ticketType: TicketType
  }
}

export type GetEventTypeRequest = {
  eventTicketId: string
}

export const getEventTicketType = async ({
  eventTicketId,
}: GetEventTypeRequest): Promise<GetEventTicketTypeResponseType> => {
  try {
    const response: GetEventTicketTypeResponseApiType = await api.get(
      `/event/ticket-type/by-id?ticketTypeId=${eventTicketId}`,
    )

    return {
      ticketType: response.data.ticketType,
      success: true,
    }
  } catch (error: unknown) {
    toast.error(
      'Ocorreu um erro ao buscar o ingresso, tente novamente mais tarde!',
    )
    return {
      message:
        'Ocorreu um erro ao buscar o ingresso, tente novamente mais tarde!',
      success: false,
    }
  }
}
