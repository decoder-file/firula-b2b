import api from '../api'
import { toast } from 'sonner'
import { OpeningHoursType } from './block.type'

export type ResponseCreateOpeningHoursType = {
  success: boolean
}

export type CreateOpeningHoursRequest = {
  companyBlockId: string
  openingHours: OpeningHoursType[]
}

export const createOpeningHours = async ({
  companyBlockId,
  openingHours,
}: CreateOpeningHoursRequest): Promise<{ success: boolean }> => {
  try {
    if (!companyBlockId) {
      toast.error(
        'Erro ao cadastrar horários da quadra, entre em contato com seu gerente de conta.',
      )
      return {
        success: false,
      }
    }

    const data = {
      companyBlockId,
      openingHours,
    }
    const url = `/company-block/opening-hours`

    const response: ResponseCreateOpeningHoursType = await api.post(url, data)

    const block = response.success

    toast.success('Horário cadastrado com sucesso!')
    return {
      success: !block,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao cadastrar horário, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
