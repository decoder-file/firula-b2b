/* eslint-disable camelcase */
import api from '../../api'
import { toast } from 'sonner'

export type UpdateEventTicketTypeResponseType = {
  message: string
  success: boolean
}

export type UpdateEventTicketTypeResponseApiType = {
  data: {
    success: boolean
    mensagem: string
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
  title: string
  ticketTypeId: string
}

export type UpdateEventTypeRequest = EventTypesType

export const updateEventTicketType = async ({
  amount,
  price,
  isActive,
  startDate,
  endDate,
  startTime,
  endTime,
  title,
  ticketTypeId,
}: UpdateEventTypeRequest): Promise<UpdateEventTicketTypeResponseType> => {
  try {
    const data = {
      amount,
      price,
      isActive,
      startDate,
      endDate,
      startTime,
      endTime,
      title,
      description: '',
      ticketTypeId,
    }

    const response: UpdateEventTicketTypeResponseApiType = await api.patch(
      '/event/ticket-type',
      data,
    )

    return {
      message: response.data.mensagem,
      success: true,
    }
  } catch (error: unknown) {
    toast.error(
      'Ocorreu um erro ao atualizar o ingresso, tente novamente mais tarde!',
    )
    return {
      message:
        'Ocorreu um erro ao atualizar o ingresso, tente novamente mais tarde!',
      success: false,
    }
  }
}
