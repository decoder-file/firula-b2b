import api from '../api'
import { toast } from 'sonner'
import { SchedulingType } from './scheduling.types'

export type GetAllSchedulingByDateResponseType = {
  data: {
    scheduling: SchedulingType[]
  }
}

type GetAllSchedulingByDateType = {
  scheduling?: SchedulingType[]
  success: boolean
}

export type GetAllSchedulingByDateRequest = {
  date: string
  companyId: string
  blockId?: string
}

export const getAllSchedulingByDate = async ({
  date,
  companyId,
  blockId,
}: GetAllSchedulingByDateRequest): Promise<GetAllSchedulingByDateType> => {
  try {
    if (!companyId) {
      toast.error(
        'Erro ao cadastrar quadra, entre em contato com seu gerente de conta.',
      )
      return {
        success: false,
      }
    }

    let url = `/scheduling/find-for-day?companyId=${companyId}&date=${date}`

    if (blockId) {
      url = `${url}&blockId=${blockId}`
    }

    const response: GetAllSchedulingByDateResponseType = await api.get(url)

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
