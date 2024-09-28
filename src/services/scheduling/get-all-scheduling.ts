import api from '../api'
import { toast } from 'sonner'
import { SchedulingType } from './scheduling.types'

export type GetAllSchedulingResponseType = {
  data: {
    scheduling: SchedulingType[]
  }
}

type GetAllSchedulingType = {
  scheduling?: SchedulingType[]
  success: boolean
}

export type GetAllSchedulingRequest = {
  page: string
  companyId: string
}

export const getAllScheduling = async ({
  page,
  companyId,
}: GetAllSchedulingRequest): Promise<GetAllSchedulingType> => {
  try {
    if (!companyId) {
      toast.error(
        'Erro ao cadastrar quadra, entre em contato com seu gerente de conta.',
      )
      return {
        success: false,
      }
    }

    const url = `/scheduling/company?companyId=${companyId}&page=${page}`

    const response: GetAllSchedulingResponseType = await api.get(url)

    const { scheduling } = response.data

    return {
      scheduling,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Erro ao buscar agendamentos, entre em contato com seu gerente de conta.',
    )
    return {
      success: false,
    }
  }
}
