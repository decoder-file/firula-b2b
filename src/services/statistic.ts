import api from './api'
import { toast } from 'sonner'

export type GetStatisticResponseType = {
  data: {
    numberOfBlocks: number
    numberOfScheduling: number
    numberOfCustomers: number
  }
}

export type GetStatisticType = {
  dashboard: {
    numberOfBlocks: number
    numberOfScheduling: number
    numberOfCustomers: number
  } | null
}

export const getStatistic = async (
  companyId: string,
): Promise<GetStatisticType> => {
  try {
    const response: GetStatisticResponseType = await api.get(
      `/statistic/b2b?companyId=${companyId}`,
    )

    const { numberOfBlocks, numberOfScheduling, numberOfCustomers } =
      response.data

    const dashboard = {
      numberOfBlocks,
      numberOfScheduling,
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
