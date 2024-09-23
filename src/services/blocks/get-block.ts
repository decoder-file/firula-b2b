import api from '../api'
import { toast } from 'sonner'
import { BlockType } from './block.type'

export type GetAllBlocksResponseType = {
  data: {
    blocks: BlockType[]
  }
}

type GetAllBlocksType = {
  blocks: BlockType[] | []
}

export type GetAllBlocksRequest = {
  page: string
  activeBlocks?: string
}

export const getAllBlocks = async ({
  page,
  activeBlocks,
}: GetAllBlocksRequest): Promise<GetAllBlocksType> => {
  try {
    let url = `company-block/all?page=${page}`

    url = activeBlocks ? `${url}&activeBlocks=true` : url

    const response: GetAllBlocksResponseType = await api.get(url)

    const { blocks } = response.data

    return {
      blocks,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar as quadras cadastradas, tente novamente mais tarde!',
    )
    return {
      blocks: [],
    }
  }
}
