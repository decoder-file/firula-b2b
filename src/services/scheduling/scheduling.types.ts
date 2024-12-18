import { BlockType } from '../blocks'

export type SchedulingType = {
  id: string
  date: string
  status: string
  paymentStatus: string
  companyBlockHourId: 'bde474bd-1c3c-4975-80d6-a002d520a97d'
  companyBlock: BlockType
  user: {
    id: string
    name: string
    email: string
    cpf: string
  }
  companyBlockHour: {
    id: string
    startTime: string
    endTime: string
  }
}
