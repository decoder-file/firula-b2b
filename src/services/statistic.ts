import api from './api'
import { toast } from 'sonner'

export type GetStatisticResponseType = {
  data: {
    numberOfBlocks: number
    numberOfCompanies: number
    numberOfCustomers: number
  }
}

export type GetStatisticType = {
  dashboard: {
    numberOfBlocks: number
    numberOfCompanies: number
    numberOfCustomers: number
  } | null
}

export const getStatistic = async (): Promise<GetStatisticType> => {
  try {
    const response: GetStatisticResponseType = await api.get('statistic')

    const { numberOfBlocks, numberOfCompanies, numberOfCustomers } =
      response.data

    const dashboard = {
      numberOfBlocks,
      numberOfCompanies,
      numberOfCustomers,
    }

    return { dashboard }
  } catch (error) {
    toast.error('Ocorreu um erro ao buscar as estatísticas')
    return {
      dashboard: null,
    }
  }
}
