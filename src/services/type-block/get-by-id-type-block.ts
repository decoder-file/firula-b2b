import api from '../api'
import { toast } from 'sonner'

import { TypeBlockType } from './type-type-block'

export type GetByIdTypeBlockResponseType = {
  data: {
    typeBlock: TypeBlockType
  }
}

type GetByIdTypeBlockType = {
  typeBlock: TypeBlockType | []
}

type GetByIdTypeBlockRequestType = {
  typeBlockId: string
}

export const getByIdTypeBlock = async ({
  typeBlockId,
}: GetByIdTypeBlockRequestType): Promise<GetByIdTypeBlockType> => {
  try {
    const url = `type-block/id?typeBlockId=${typeBlockId}`

    const response: GetByIdTypeBlockResponseType = await api.get(url)

    const { typeBlock } = response.data

    return {
      typeBlock,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar tipos de quadras, tente novamente mais tarde!',
    )
    return {
      typeBlock: [],
    }
  }
}
