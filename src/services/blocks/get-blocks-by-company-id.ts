import api from '../api'
import { toast } from 'sonner'
import { BlockType } from './block.type'

export type GetBlocksByCompanyIdResponseType = {
  data: {
    block: BlockType[]
  }
}

type GetBlocksByCompanyIdResquestType = {
  companyId: string
}

type GetBlocksByCompanyIdType = {
  blocks?: BlockType[] | []
  success: boolean
}

export const getBlocksByCompanyId = async ({
  companyId,
}: GetBlocksByCompanyIdResquestType): Promise<GetBlocksByCompanyIdType> => {
  try {
    if (!companyId) {
      toast.error(
        'Ocorreu um erro ao buscar as quadras cadastradas, tente novamente mais tarde!',
      )
      return {
        success: false,
      }
    }

    const url = `company-block/companyId?companyId=${companyId}`

    const response: GetBlocksByCompanyIdResponseType = await api.get(url)

    const { block } = response.data

    return {
      blocks: block,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar as quadras cadastradas, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
