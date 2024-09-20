import axios from 'axios'
import { toast } from 'sonner'

const api = axios.create({
  // baseURL: 'https://firula-backend.onrender.com',
  baseURL: 'http://localhost:3333',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Checa se a resposta foi 401 (não autorizado) e se já tentou atualizar o token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          // Caso não tenha o refreshToken, redireciona imediatamente para o login
          window.location.href = '/sign-in'
          toast.error('Sua sessão expirou, faça login novamente')
          return Promise.reject(error)
        }

        // Tenta atualizar o token
        const response = await api.patch('token/refresh', {
          refreshToken,
        })

        const { token } = response.data

        // Salva o novo token no localStorage
        localStorage.setItem('token', token)

        // Atualiza o cabeçalho Authorization com o novo token
        originalRequest.headers.Authorization = `Bearer ${token}`

        // Refaz a requisição original com o novo token
        return axios(originalRequest)
      } catch (refreshError) {
        // Limpa os tokens e redireciona para o login caso a atualização falhe
        localStorage.setItem('token', '')
        localStorage.setItem('refreshToken', '')
        window.location.href = '/sign-in'
        toast.error('Sua sessão expirou, faça login novamente')
        return Promise.reject(refreshError)
      }
    }

    // Verifica se a mensagem de erro é "Unauthorized." para redirecionar ao login
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === 'Unauthorized.'
    ) {
      localStorage.setItem('token', '')
      localStorage.setItem('refreshToken', '')

      window.location.href = '/sign-in' // Redireciona para a página de login
      toast.error('Sua sessão expirou, faça login novamente')
    }

    // Extrair a mensagem de erro do backend, se existir
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message
      const statusCode = error.response.status
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: errorMessage, statusCode })
    }

    return Promise.reject(error)
  },
)

export default api
