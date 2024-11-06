/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../../api'
import { toast } from 'sonner'

export type ResetPasswordSendTokeResponseType = {
  userId: string
  message?: string
  success: boolean
}

export type ResetPasswordSendTokeResponseApiType = {
  data: {
    success: boolean
    message: string
    userId: string
  }
}

export type ResetPasswordSendTokenRequest = {
  document: string
}

export const resetPasswordSendToken = async ({
  document,
}: ResetPasswordSendTokenRequest): Promise<ResetPasswordSendTokeResponseType> => {
  try {
    const data = {
      documentNumber: document.replace(/[^\d]/g, ''),
    }

    const response: ResetPasswordSendTokeResponseApiType = await api.post(
      'reset-password/send-token',
      data,
    )

    const user = response.data.userId

    toast.success('Token enviado com sucesso!')
    return {
      userId: user,
      success: true,
    }
  } catch (error: any) {
    if (error.statusCode === 409) {
      toast.error(error.message)
      return {
        userId: '',
        success: false,
      }
    }
    toast.error('Erro ao enviar token, verifique os dados e tente novamente!')
    return {
      userId: '',
      success: false,
    }
  }
}
