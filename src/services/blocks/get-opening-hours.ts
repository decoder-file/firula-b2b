import api from '../api'
import { toast } from 'sonner'
import { OpeningHoursType } from './block.type'

export type ResponseGetOpeningHoursType = {
  data: {
    openingHours: OpeningHoursType[]
  }
}

export type GetOpeningHoursRequest = {
  companyBlockId: string
}

export type GetOpeningHoursResponse = {
  success: boolean
  openingHours?: OpeningHoursType[]
}

export const getOpeningHours = async ({
  companyBlockId,
}: GetOpeningHoursRequest): Promise<GetOpeningHoursResponse> => {
  try {
    if (!companyBlockId) {
      toast.error(
        'Erro ao buscar horários da quadra, entre em contato com seu gerente de conta.',
      )
      return {
        success: false,
      }
    }

    const url = `/company-block/opening-hours?companyBlockId=${companyBlockId}`

    const response: ResponseGetOpeningHoursType = await api.get(url)

    const { data } = response

    return {
      success: true,
      openingHours: data.openingHours,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar horário, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
