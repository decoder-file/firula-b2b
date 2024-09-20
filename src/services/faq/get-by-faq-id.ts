import api from '../api'
import { toast } from 'sonner'
import { FaqType } from './type-faq'

export type GetByFaqIdResponseType = {
  data: {
    faq: FaqType
  }
}

type GetByFaqIdTypeRequest = {
  faqId: string
}

type GetByFaqIdResponse = {
  faq?: FaqType
  success: boolean
}

export const getByFaqId = async ({
  faqId,
}: GetByFaqIdTypeRequest): Promise<GetByFaqIdResponse> => {
  try {
    if (faqId?.length === 0) {
      toast.error('Pergunta não encontrado!')
      return {
        success: false,
      }
    }
    const url = `faq/id?faqId=${faqId}`

    const response: GetByFaqIdResponseType = await api.get(url)

    const { data } = response

    return {
      success: true,
      faq: data.faq,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao buscar perguntar, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
