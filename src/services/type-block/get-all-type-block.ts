import api from '../api'
import { toast } from 'sonner'
import { TypeBlockType } from './type-type-block'

export type GetAllTypeBlockResponseType = {
  data: {
    typeBlock: TypeBlockType[]
  }
}

type GetAllTypeBlockType = {
  typesBlock: TypeBlockType[] | []
}

export const getAllTypeBlock = async (): Promise<GetAllTypeBlockType> => {
  try {
    const url = `type-block`

    const response: GetAllTypeBlockResponseType = await api.get(url)

    const { typeBlock } = response.data

    return {
      typesBlock: typeBlock,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar os tipos de quadras, tente novamente mais tarde!',
    )
    return {
      typesBlock: [],
    }
  }
}
