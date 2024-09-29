import api from '../api'
import { toast } from 'sonner'
import { BlockType } from './block.type'

export type GetBlockByIdResponseType = {
  data: {
    block: BlockType
  }
}

type GetBlockByIdType = {
  block?: BlockType
  success: boolean
}

export type GetBlockByIdRequest = {
  blockId: string
}

export const getBlockById = async ({
  blockId,
}: GetBlockByIdRequest): Promise<GetBlockByIdType> => {
  try {
    const url = `/company-block?blockId=${blockId}`

    const response: GetBlockByIdResponseType = await api.get(url)

    const { block } = response.data

    return {
      block,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar as informações da quadra, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
