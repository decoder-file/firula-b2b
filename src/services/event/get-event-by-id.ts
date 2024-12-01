import api from '../api'
import { toast } from 'sonner'
import { EventType } from './event-type'

export type GetEventByIdResponseType = {
  data: {
    event: EventType
  }
}

type GetEventByIdType = {
  event?: EventType
  success: boolean
}

export type GetEventByIdRequest = {
  eventId: string
}

export const getEventById = async ({
  eventId,
}: GetEventByIdRequest): Promise<GetEventByIdType> => {
  try {
    const url = `/event/by-id?eventId=${eventId}`

    const response: GetEventByIdResponseType = await api.get(url)

    const { event } = response.data

    return {
      event,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar os eventos, tente novamente mais tarde. (#020001)',
    )
    return {
      success: false,
    }
  }
}
