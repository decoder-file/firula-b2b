import api from '../../api'
import { toast } from 'sonner'
import { TypeBlockType } from './type-block-types'

export type GetAllTypeBlockResponseType = {
  data: {
    typeBlock: TypeBlockType[]
  }
}

type GetAllTypeBlockType = {
  typeBlock?: TypeBlockType[]
  success: boolean
}

export const getAllTypeBlock = async (): Promise<GetAllTypeBlockType> => {
  try {
    const response: GetAllTypeBlockResponseType = await api.get('/type-block')

    const { typeBlock } = response.data

    return {
      typeBlock,
      success: true,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar os tipos de quadras, tente novamente mais tarde.',
    )
    return {
      success: false,
    }
  }
}
