export type OpeningHoursType = {
  dayOfWeek: string
  startTime: string
  endTime: string
  active: boolean
  priceForHour: string
  valueForHourDayUse: string
  dayUseActive: boolean
}

export type BlockType = {
  id: string
  name: string
  valueForHour: string
  imageUrl: string
  isActive: string
  typeBlockId: string
  sports: string[]
  companyId: string
  openingHours?: OpeningHoursType[]
}
