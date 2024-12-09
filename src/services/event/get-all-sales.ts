import api from '../api'
import { toast } from 'sonner'
import { Ticket } from './event-type'

export type GetAllSalesResponseType = {
  data: {
    sales: Ticket[]
  }
}

type GetAllSalesType = {
  sales?: Ticket[]
  success: boolean
}

export type GetAllSalesRequest = {
  eventId: string
  page: string
  nameQuery: string
}

export const getAllSales = async ({
  eventId,
  page,
  nameQuery,
}: GetAllSalesRequest): Promise<GetAllSalesType> => {
  try {
    let url = `/event/sales?eventId=${eventId}&page=${page}`

    if (nameQuery) {
      url += `&nameQuery=${nameQuery}`
    }

    const response: GetAllSalesResponseType = await api.get(url)

    const { sales } = response.data

    return {
      sales,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar as vendas, tente novamente mais tarde',
    )
    return {
      success: false,
    }
  }
}
