import api from '../api'
import { toast } from 'sonner'

export type UpdateTypeBlockResponseType = {
  id: string
}

type UpdateTypeBlockTypeRequest = {
  typeBlockId: string | undefined
  name: string
}

export const updateTypeBlock = async ({
  typeBlockId,
  name,
}: UpdateTypeBlockTypeRequest): Promise<{ success: boolean }> => {
  try {
    if (typeBlockId?.length === 0) {
      toast.error('Tipo de quadra não encontrado!')
      return {
        success: false,
      }
    }
    const url = `type-block?typeBlockId=${typeBlockId}`

    const response: UpdateTypeBlockResponseType = await api.patch(url, { name })

    const { id } = response

    return {
      success: !id,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao atualizar o tipo de quadra, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
