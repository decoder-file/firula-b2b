/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../../api'
import { toast } from 'sonner'

export type ResetPasswordResponseType = {
  userId: string
  message?: string
  success: boolean
}

export type ResetPasswordResponseApiType = {
  data: {
    success: boolean
    message: string
    userId: string
  }
}

export type ResetPasswordRequest = {
  newPassword: string
  userId: string
  code: string
}

export const resetPassword = async ({
  newPassword,
  userId,
  code,
}: ResetPasswordRequest): Promise<ResetPasswordResponseType> => {
  try {
    const data = {
      newPassword,
      userId,
      code,
    }

    const response: ResetPasswordResponseApiType = await api.post(
      'reset-password',
      data,
    )

    const user = response.data.userId

    toast.success('Senha alterada com sucesso!')
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
    toast.error('Erro ao alterar senha, verifique os dados e tente novamente!')
    return {
      userId: '',
      success: false,
    }
  }
}
