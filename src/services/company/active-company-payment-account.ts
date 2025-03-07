import api from '../api'
import { toast } from 'sonner'

export type ActiveCompanyPaymentAccountResponseType = {
  data: {
    mensage: string
    succes: string
  }
}

export type ActiveCompanyPaymentAccountType = {
  success: boolean
  mensage: string
}

export type ActiveCompanyPaymentAccountRequest = {
  companyId: string
}

export const activeCompanyPaymentAccount = async ({
  companyId,
}: ActiveCompanyPaymentAccountRequest): Promise<ActiveCompanyPaymentAccountType> => {
  try {
    const url = `/active-payment-account?companyId=${companyId}`

    const response: ActiveCompanyPaymentAccountResponseType =
      await api.post(url)

    const { mensage, succes } = response.data

    return {
      mensage,
      success: succes === 'true',
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao ativar a conta de pagamento da empresa, por favor tente novamente.',
    )
    return {
      mensage:
        'Ocorreu um erro ao ativar a conta de pagamento da empresa, por favor tente novamente.',
      success: false,
    }
  }
}
