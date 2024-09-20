import api from '../api'
import { toast } from 'sonner'

export type DeleteTypeBlockResponseType = {
  success: boolean
}

type DeleteTypeBlockType = {
  success: boolean
}

type DeleteTypeBlockRequestType = {
  typeBlockId: string
}

export const deleteTypeBlock = async ({
  typeBlockId,
}: DeleteTypeBlockRequestType): Promise<DeleteTypeBlockType> => {
  try {
    const url = `type-block?typeBlockId=${typeBlockId}`

    const response = await api.delete(url)

    return {
      success: response.data.success,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao deletar tipos de quadras, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
