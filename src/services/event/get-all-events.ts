import api from '../api'
import { toast } from 'sonner'
import { EventType } from './event-type'

export type GetEventsResponseType = {
  data: {
    event: EventType[]
  }
}

type GetEventsType = {
  events?: EventType[]
  success: boolean
}

export type getEventsRequest = {
  companyId: string
}

export const getEvents = async ({
  companyId,
}: getEventsRequest): Promise<GetEventsType> => {
  try {
    if (!companyId) {
      toast.error(
        'Ocorreu um erro ao buscar os eventos, tente novamente mais tarde. (#030303)',
      )
      return {
        success: false,
      }
    }

    const url = `event/by-company-id?companyId=${companyId}`

    const response: GetEventsResponseType = await api.get(url)

    const { event } = response.data

    return {
      events: event,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar os eventos, tente novamente mais tarde.',
    )
    return {
      success: false,
    }
  }
}
