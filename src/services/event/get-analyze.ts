/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api'
import { toast } from 'sonner'

export type GetAnalyzeResponseType = {
  message: string
  success: boolean
  pageView?: number
  totalRevenue?: number
  tickets?: {
    ticketType: string
    totalSales: number
    totalPrice: number
  }[]
  totalSales?: number
  recentSales?: {
    userId: string
    userEmail: string
    userPhoneNumber: string
    userName: string
    priceTicket: string
  }[]
}

export type GetAnalyzeResponseApiType = {
  data: {
    pageView: number
    totalRevenue: number
    tickets: {
      ticketType: string
      totalSales: number
      totalPrice: number
    }[]
    totalSales: number
    sales: {
      userId: string
      userEmail: string
      userPhoneNumber: string
      userName: string
      priceTicket: string
    }[]
  }
}

export type GetAnalyzeRequest = {
  eventId: string
}

export const getAnalyze = async ({
  eventId,
}: GetAnalyzeRequest): Promise<GetAnalyzeResponseType> => {
  try {
    const response: GetAnalyzeResponseApiType = await api.get(
      `/event/analytics?eventId=${eventId}`,
    )

    return {
      message: 'Análise de evento gerada com sucesso.',
      success: true,
      pageView: response.data.pageView,
      totalRevenue: response.data.totalRevenue,
      tickets: response.data.tickets,
      totalSales: response.data.totalSales,
      recentSales: response.data.sales.map((sale) => ({
        userId: sale.userId,
        userName: sale.userName,
        userEmail: sale.userEmail,
        userPhoneNumber: sale.userPhoneNumber,
        priceTicket: sale.priceTicket,
      })),
    }
  } catch (error: any) {
    if (error.statusCode === 409) {
      toast.error(error.message)
      return {
        success: false,
        message: error.message,
      }
    }
    toast.error(
      'Ocorreu um erro ao tentar gerar análise de evento. Tente novamente.',
    )
    return {
      success: false,
      message:
        'Ocorreu um erro ao tentar gerar análise de evento. Tente novamente.',
    }
  }
}
