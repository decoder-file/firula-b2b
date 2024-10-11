import moment from 'moment'
import api from '../api'
import { toast } from 'sonner'

export type BlockScheduleResponseType = {
  blockHourId: string
}

export type BlockScheduleRequest = {
  hour: string
  blockId: string
  date: moment.Moment
}

export const blockSchedule = async ({
  hour,
  blockId,
  date,
}: BlockScheduleRequest): Promise<{ success: boolean }> => {
  try {
    if (!blockId) {
      toast.error(
        'Erro ao criar bloqueio, entre em contato com seu gerente de conta.',
      )
      return {
        success: false,
      }
    }

    const endTime = moment(hour, 'HH:mm').add(1, 'hours').format('HH:mm')

    const data = {
      date,
      startTime: hour,
      endTime,
      blockId,
    }
    const url = `company-block-hour`

    const response: BlockScheduleResponseType = await api.post(url, data)

    const block = response.blockHourId

    toast.success('Bloqueio criado com sucesso!')
    return {
      success: !block,
    }
  } catch (error) {
    toast.error(
      'Ocorreu um erro ao criar bloqueio, tente novamente mais tarde!',
    )
    return {
      success: false,
    }
  }
}
