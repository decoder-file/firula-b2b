import api from '../api'
import { toast } from 'sonner'
import { FaqType } from './type-faq'

export type CreateFaqResponseType = {
  faq: FaqType
}

type CreateFaqType = {
  success: boolean
}

type CreateFaqTypeRequest = {
  question: string
  answer: string
  category: string
}

export const createFaq = async ({
  question,
  answer,
  category,
}: CreateFaqTypeRequest): Promise<CreateFaqType> => {
  try {
    const url = `faq`

    const response: FaqType = await api.post(url, {
      question,
      answer,
      category,
    })

    const { id } = response

    return {
      success: !id,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao criar pergunta, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
