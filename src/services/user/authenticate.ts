import api from '../api'
import { toast } from 'sonner'

export type AuthenticateResponseType = {
  data: {
    token: string
    user: {
      id: string
      name: string
      email: string
      cpf: string
      role: string
      isBlock: boolean
      imageUrl: string | null
    }
  }
}

export const authenticate = async (email: string, password: string) => {
  try {
    const data = {
      email,
      password,
    }

    const response: AuthenticateResponseType = await api.post('sign-in', data)

    console.log(response.data)
    const { token, user } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('userId', user.id)

    if (user?.role) {
      localStorage.setItem('role', user.role)
    }

    return {
      user,
      success: true,
    }
  } catch (error) {
    toast.error('Email ou senha incorreto!')
    return {
      success: false,
    }
  }
}
