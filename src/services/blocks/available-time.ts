import { toast } from 'sonner'

import api from '../api'

export type AvailableTimeType = {
  hour: string
  status: string
}

export type GetAvailableTimeRequestType = {
  date: string
  blockId: string
}

export type GetAvailableTimeResponseType = {
  data: {
    courtTimes: AvailableTimeType[]
    valueForHour: string
    dayUseActive: boolean
    valueForHourDayUse: string
  }
}

export type FetchAvailableTimeResponseType = {
  courtTimes?: AvailableTimeType[]
  valueForHour?: string
  success: boolean
  typeError?: string
  dayUseActive?: boolean
  valueForHourDayUse?: string
}

export const getAvailableTime = async ({
  date,
  blockId,
}: GetAvailableTimeRequestType): Promise<FetchAvailableTimeResponseType> => {
  try {
    const url = `/company-block/available-times?blockId=${blockId}&date=${date}`

    const response: GetAvailableTimeResponseType = await api.get(url)

    return {
      courtTimes: response.data.courtTimes,
      valueForHour: response.data.valueForHour,
      success: true,
      dayUseActive: response.data.dayUseActive,
      valueForHourDayUse: response.data.valueForHourDayUse,
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).statusCode === 409) {
      return {
        success: false,
        typeError: 'closedCompany',
      }
    }

    toast.error(
      'Ocorreu um erro ao buscar os horários disponíveis, tente novamente',
    )
    return {
      success: false,
    }
  }
}
