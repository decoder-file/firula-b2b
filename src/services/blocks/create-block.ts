import api from '../api'
import { toast } from 'sonner'

export type CreateBlockResponseType = {
  blockId: string
}

export type CreateBlockRequest = {
  name: string
  valueForHour: string
  typeBlockId: string
  sports: string[]
  imageUrl?: string
  openingHours: {
    dayOfWeek: string
    startTime: string
    endTime: string
    active: boolean
  }[]
  companyId: string
}

export const createBlock = async ({
  name,
  valueForHour,
  typeBlockId,
  sports,
  imageUrl,
  openingHours,
  companyId,
}: CreateBlockRequest): Promise<{ success: boolean }> => {
  try {
    if (!companyId) {
      toast.error(
        'Erro ao cadastrar quadra, entre em contato com seu gerente de conta.',
      )
      return {
        success: false,
      }
    }

    const data = {
      companyId,
      name,
      valueForHour,
      typeBlockId,
      sports,
      imageUrl,
      openingHours,
    }
    const url = `company-block`

    const response: CreateBlockResponseType = await api.post(url, data)

    const block = response.blockId

    toast.success('Quadra criada com sucesso!')
    return {
      success: !block,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao criar a quadra, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
