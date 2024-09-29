import api from '../api'
import { toast } from 'sonner'
import { OpeningHoursType } from './block.type'

export type UpdateBlocksResponseType = {
  blockId: string
}

export type UpdateBlocksRequest = {
  blockId: string
  name?: string
  valueForHour?: string
  typeBlockId?: string
  isActive?: boolean
  openingHours?: OpeningHoursType[]
  sports?: string[]
  imageUrl?: string
}

export const updateBlocks = async ({
  blockId,
  name,
  valueForHour,
  typeBlockId,
  isActive,
  openingHours,
  sports,
  imageUrl,
}: UpdateBlocksRequest): Promise<{ success: boolean }> => {
  try {
    const data = {
      name,
      valueForHour,
      typeBlockId,
      isActive,
      openingHours,
      sports,
      imageUrl,
    }
    const url = `company-block?blockId=${blockId}`

    const response: UpdateBlocksResponseType = await api.patch(url, data)

    const block = response.blockId

    toast.success('Quadra atualizada com sucesso!')
    return {
      success: !block,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao atualizar a quadra, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
